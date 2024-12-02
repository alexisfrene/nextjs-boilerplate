"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, createRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui";
import { Button, Input, Multiselect } from "@/components";
import { toast } from "sonner";
import {
  MdInfoOutline,
  MdModeEdit,
  MdOutlineAbc,
  MdEmail,
  MdOutline123,
  MdChecklist,
  MdCorporateFare,
} from "react-icons/md";
import { Worker } from "@/lib";
import { editCustomerWorker, editWorker } from "@/lib";
import { getWorker, getRoles, isCustomer, getCustomers } from "@/lib";

import { ScrollArea } from "@/ui";
import { ImageCropper } from "@/ui";

function EditOperatorModal({ workerId }: any) {
  const [open, setOpen] = useState(false);
  const [worker, setWorker] = useState({} as Worker);
  const [roles, setRoles] = useState([]);
  const [rolesSelected, setRolesSelected] = useState([]);
  const [token, setToken] = useState("");
  const [editInfo, setEditInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const multiselectRef = createRef();
  const multiselectRef2 = createRef();

  const [avatar, setAvatar] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signatureOpen, setSignatureOpen] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customersSelected, setCustomersSelected] = useState([]);
  const [customers, setCustomers] = useState([]);

  var params = {
    page: 0,
    size: 99,
  };

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setLoading(false);
      }
      const token = session?.user?.token;
      setToken(token);
      const roles = await getRoles(token, params);
      setRoles(roles);
      const customers = await getCustomers(token, "", params);
      setCustomers(customers.response.items);
      // setCustomers((previous) => [...previous, customers.response.items]);
    })();
  }, []);

  function onSelectRoles(selectedItems: any) {
    setRolesSelected(selectedItems);
  }

  function onSelectCustomers(selectedItems: any) {
    setCustomersSelected(selectedItems);
  }

  function handleClickEdit(workerId: string, edit: boolean) {
    setEditInfo(edit);
    setOpen(true);
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setLoading(false);
      }
      const token = session?.user?.token;
      const result = await getWorker(token, workerId);
      if (result.statusCode === 200) {
        setWorker(result.response);
        setRolesSelected(result.response.roles);
        setCustomersSelected(result.response.customers);
        setAvatar(result.response.avatar);
        setSignature(result.response.signature);
      } else {
        toast.error("Error: ", {
          description: result.message,
          className:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
          position: "top-right",
        });
      }
    })();
  }

  function handleClickCustomer(workerId: string) {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setLoading(false);
      }
      setCustomerOpen(false);
      const token = session?.user?.token;
      const result = await isCustomer(token, workerId);
      if (result === false) {
        toast.error("Error: ", {
          description: "Usuario no es un Cliente",
          className:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
          position: "top-right",
        });
        setCustomerId("");
        return;
      }

      setCustomerId(workerId);
      setCustomerOpen(true);
    })();
  }

  const onBeforeFileLoad = (elem: any) => {
    if (elem.target.files[0].size > 150000) {
      alert("El archivo es muy grande!");
      elem.target.value = "";
    }
  };

  const updateAvatar = (imgSrc: any) => {
    setAvatar(imgSrc);
  };

  const saveAvatar = (imgSrc: any) => {
    setAvatar(imgSrc);
    setAvatarOpen(false);
  };

  const updateSignature = (imgSrc: any) => {
    setSignature(imgSrc);
  };

  const saveSignature = (imgSrc: any) => {
    setSignature(imgSrc);
    setSignatureOpen(false);
  };

  return (
    <>
      <div className="flex">
        <Button
          onClick={() => handleClickEdit(workerId, false)}
          variant="outline"
          className="place-self-center"
          size="icon"
        >
          <MdInfoOutline className="h-4 w-4" size={6} />
        </Button>
        <Button
          onClick={() => handleClickEdit(workerId, true)}
          variant="outline"
          className="place-self-center"
          size="icon"
        >
          <MdModeEdit className="h-4 w-4 p-0" size={6} />
        </Button>
        <Button
          onClick={() => handleClickCustomer(workerId)}
          variant="outline"
          className="place-self-center"
          size="icon"
        >
          <MdCorporateFare className="h-4 w-4" size={6} />
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <ScrollArea className="h-svh whitespace-nowrap rounded-md border">
              <DialogHeader>
                <DialogTitle>
                  <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                    {editInfo ? (
                      <>Modificar Cuenta</>
                    ) : (
                      <>Información de la Cuenta</>
                    )}
                  </h1>
                </DialogTitle>
                <DialogDescription>
                  <div>
                    <form
                      action={async (formData) => {
                        if (editInfo) {
                          formData.append(
                            "roles",
                            JSON.stringify(rolesSelected)
                          );
                          let filesObject: any[] = [];
                          if (avatar) {
                            const avatarFile = new File(
                              [avatar],
                              "avatar.png",
                              { type: "image/png" }
                            );
                            formData.append("files", avatarFile);
                            const objetAvatar = {
                              typeFile: "avatar",
                              fileName: avatarFile.name,
                            };
                            filesObject.push(objetAvatar);
                          }

                          if (signature) {
                            const signatureFile = new File(
                              [signature],
                              "signature.png",
                              { type: "image/png" }
                            );
                            formData.append("files", signatureFile);
                            const objetSignature = {
                              typeFile: "signature",
                              fileName: signatureFile.name,
                            };
                            filesObject.push(objetSignature);
                          }
                          const result = await editWorker(
                            token,
                            worker?.id,
                            formData,
                            filesObject
                          );
                          if (result.statusCode === 200) {
                            toast.success("Exito: ", {
                              description: result.message,
                              className:
                                "group border-green bg-green-600 text-white",
                              position: "top-right",
                            });
                          } else {
                            toast.error("Error: ", {
                              description: result.message,
                              className:
                                "destructive group border-destructive bg-destructive text-destructive-foreground",
                              position: "top-right",
                            });
                          }
                        }
                        setOpen(false);
                      }}
                    >
                      <div className="grid content-between w-full">
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="userFile"
                            defaultValue={worker.userFile}
                            readOnly={!editInfo}
                            type="text"
                            placeholder="Numero de Legajo de Usuario"
                          />
                        </div>
                        <div className="place-self-center w-8/12 mb-2">
                          <div className="grid grid-rows-2 grid-flow-col place-self-center">
                            <div className="col-span-1">
                              <Input
                                name="userName"
                                defaultValue={worker.userName}
                                readOnly={!editInfo}
                                type="text"
                                required
                                placeholder="Identificador de Operador"
                              />
                            </div>
                            <div className="col-span-1">
                              <Input
                                name="firstName"
                                defaultValue={worker.firstName}
                                readOnly={!editInfo}
                                type="text"
                                required
                                placeholder="Nombres de Operador"
                              />
                            </div>
                            <div className="row-span-2 ml-8 flex justify-center items-center">
                              <div
                                className="cursor-pointer"
                                onClick={
                                  editInfo
                                    ? () => setAvatarOpen(true)
                                    : undefined
                                }
                              >
                                <img
                                  style={{
                                    width: "128px",
                                    height: "128px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                  src={avatar ? avatar : "/images/noavatar.png"}
                                  alt="Avatar"
                                />
                              </div>
                              <Dialog open={avatarOpen}>
                                <DialogContent>
                                  <DialogTitle>
                                    <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                                      Subir Avatar
                                    </h1>
                                  </DialogTitle>
                                  <ImageCropper
                                    updateImage={updateAvatar}
                                    onSave={saveAvatar}
                                  />
                                  <DialogFooter className="sm:justify-end">
                                    <DialogClose>
                                      <div className="flex mb-1 items-center justify-end">
                                        <div>
                                          <Button
                                            onClick={() => setAvatarOpen(false)}
                                            variant="ghost"
                                          >
                                            Cancelar
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="lastName"
                            defaultValue={worker.lastName}
                            readOnly={!editInfo}
                            type="text"
                            required
                            placeholder="Apellidos de Operador"
                          />
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="address"
                            defaultValue={worker.address}
                            readOnly={!editInfo}
                            type="text"
                            placeholder="Dirección del Operador"
                          />
                        </div>
                        <div className="place-self-center w-8/12 mb-2">
                          <div className="grid grid-rows-2 grid-flow-col place-self-center">
                            <div className="col-span-1">
                              <Input
                                name="email"
                                defaultValue={worker.email}
                                readOnly={!editInfo}
                                type="email"
                                required
                                placeholder="Correo Electrónico"
                              />
                            </div>
                            <div className="col-span-1">
                              <Input
                                name="phone"
                                defaultValue={worker.phone}
                                readOnly={!editInfo}
                                type="text"
                                placeholder="Telefono del Operador"
                              />
                            </div>
                            <div className="row-span-2 ml-8 flex justify-center items-center">
                              <div
                                className="cursor-pointer"
                                onClick={
                                  editInfo
                                    ? () => setSignatureOpen(true)
                                    : undefined
                                }
                              >
                                <img
                                  style={{
                                    width: "164px",
                                    height: "128px",
                                  }}
                                  src={
                                    signature
                                      ? signature
                                      : "/images/nosignature.png"
                                  }
                                  alt="Signature"
                                />
                              </div>
                              <Dialog open={signatureOpen}>
                                <DialogContent>
                                  <DialogTitle>
                                    <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                                      Subir Firma
                                    </h1>
                                  </DialogTitle>
                                  <ImageCropper
                                    updateImage={updateSignature}
                                    onSave={saveSignature}
                                  />
                                  <DialogFooter className="sm:justify-end">
                                    <DialogClose>
                                      <div className="flex mb-1 items-center justify-end">
                                        <div>
                                          <Button
                                            onClick={() =>
                                              setSignatureOpen(false)
                                            }
                                            variant="ghost"
                                          >
                                            Cancelar
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          {editInfo ? (
                            <Multiselect
                              placeholder="Seleccionar roles"
                              emptyRecordMsg="No hay roles para asignar"
                              showCheckbox={true}
                              isObject={true}
                              id="id"
                              displayValue="description"
                              ref={() => {
                                multiselectRef;
                              }}
                              onKeyPressFn={function noRefCheck() {}}
                              onRemove={onSelectRoles}
                              onSearch={function noRefCheck() {}}
                              onSelect={onSelectRoles}
                              options={roles}
                              selectedValues={worker.roles}
                            />
                          ) : (
                            <Input
                              name="roles"
                              defaultValue={worker?.roles?.map(
                                (role: any) => role.description
                              )}
                              readOnly={!editInfo}
                              type="text"
                            />
                          )}
                        </div>
                        <div className="flex place-self-end w-8/12">
                          <div>
                            <Button
                              variant="ghost"
                              onClick={() => setEditInfo(false)}
                              className="ml-12"
                            >
                              CANCELAR
                            </Button>
                          </div>
                          {editInfo && (
                            <div>
                              <Button
                                variant="outline"
                                type="submit"
                                className="ml-12"
                              >
                                MODIFICAR DATOS
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        {customerId && (
          <Dialog open={customerOpen} onOpenChange={setCustomerOpen}>
            <DialogContent className="h-1/2">
              <ScrollArea className="whitespace-nowrap rounded-md border">
                <DialogHeader>
                  <DialogTitle>
                    <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                      Asignar Empresas a Cliente
                    </h1>
                  </DialogTitle>
                  <DialogDescription>
                    <div>
                      <form
                        action={async (formData) => {
                          if (customersSelected.length === 0) {
                            toast.error("Error: ", {
                              description:
                                "Debe seleccionar al menos un cliente",
                              className:
                                "destructive group border-destructive bg-destructive text-destructive-foreground",
                              position: "top-right",
                            });
                            return;
                          }

                          formData.append(
                            "customers",
                            JSON.stringify(customersSelected)
                          );
                          const result = await editCustomerWorker(
                            token,
                            workerId,
                            formData
                          );
                          if (result.statusCode === 200) {
                            toast.success("Exito: ", {
                              description: result.message,
                              className:
                                "group border-green bg-green-600 text-white",
                              position: "top-right",
                            });
                          } else {
                            toast.error("Error: ", {
                              description: result.message,
                              className:
                                "destructive group border-destructive bg-destructive text-destructive-foreground",
                              position: "top-right",
                            });
                          }
                          setCustomerOpen(false);
                        }}
                      >
                        <div className="grid content-between w-full">
                          <div className="mb-6 place-self-center w-8/12">
                            <Multiselect
                              placeholder="Seleccionar Clientes"
                              emptyRecordMsg="No hay Clientes para asignar"
                              showCheckbox={true}
                              isObject={true}
                              id="id"
                              displayValue="name"
                              ref={() => {
                                multiselectRef2;
                              }}
                              onKeyPressFn={function noRefCheck() {}}
                              onRemove={onSelectCustomers}
                              onSearch={function noRefCheck() {}}
                              onSelect={onSelectCustomers}
                              options={customers}
                              selectedValues={worker.customers}
                            />
                          </div>
                          <div className="flex place-self-end w-8/12">
                            <div>
                              <Button
                                variant="ghost"
                                onClick={() => setCustomerOpen(false)}
                                className="ml-12"
                              >
                                CANCELAR
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              type="submit"
                              className="ml-12"
                            >
                              ASIGNAR CLIENTES
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default EditOperatorModal;
