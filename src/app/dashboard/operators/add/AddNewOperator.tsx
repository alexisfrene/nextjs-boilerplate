"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui";
import { Button, Input, Label, Multiselect } from "@/components";
import {
  MdUpdate,
  MdAdd,
  MdDelete,
  MdKey,
  MdOutline123,
  MdOutlineAbc,
  MdEmail,
} from "react-icons/md";
import { toast } from "sonner";
import { getCustomers, getRoles } from "@/lib";
import { addWorker, deleteWorkers } from "@/lib";
import { ScrollArea } from "@/ui";
import { Role } from "@/lib";
import { ImageCropper } from "@/ui";

interface paramsProps {
  selectedRows?: any;
}

function AddNewOperator({ selectedRows }: paramsProps) {
  const [open, setOpen] = useState(false);
  const [opendel, setOpenDelete] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesSelected, setRolesSelected] = useState<Role[]>([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const multiselectRef = createRef();
  const multiselectRef2 = createRef();

  const [avatar, setAvatar] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signatureOpen, setSignatureOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customersSelected, setCustomersSelected] = useState([]);

  var params = {
    page: 0,
    size: 20,
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

      const token = session?.user?.token as string;
      setToken(token);
      let roles = await getRoles(token, params);
      setRoles(roles);
      const customers = await getCustomers(token, "", params);
      setCustomers(customers.response.items);
    })();
  }, []);

  function onSelectRoles(selectedItems: any) {
    setRolesSelected(selectedItems);
    console.log("rolesSelected: ", rolesSelected);
  }

  function onSelectCustomers(selectedItems: any) {
    setCustomersSelected(selectedItems);
  }

  if (loading) {
    return (
      <div>
        <Button className="w-full flex justify-center items-center" disabled>
          <MdUpdate className="mr-2 text-accent h-4 w-4 animate-spin" />
          Cargando...
        </Button>
      </div>
    );
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
    <div className="content-end">
      <div className="flex">
        <Button
          onClick={() => setOpenDelete(true)}
          variant="destructive"
          className="place-self-center"
        >
          Deshabilitar
          <MdDelete className="h-4 w-4" size={20} />
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="place-self-center"
        >
          <span>Nuevo&nbsp;&nbsp;&nbsp;</span>
          <MdAdd className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={opendel} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Esta seguro de deshabilitarlos? <br />
              <br />
              {selectedRows &&
                selectedRows.map((item: any) => (
                  <div key={item.id}>{item.original.name}</div>
                ))}
            </DialogTitle>
            <DialogDescription>
              <div>
                <form
                  action={async () => {
                    let ids: string[] = [];
                    selectedRows?.forEach((item: any) => {
                      ids.push(item.id);
                    });
                    if (ids.length === 0) {
                      toast.error("Error: ", {
                        description: "Debe seleccionar al menos un elemento",
                        className:
                          "destructive group border-destructive bg-destructive text-destructive-foreground",
                        position: "top-right",
                      });
                      return;
                    }
                    const result = await deleteWorkers(token, ids);
                    if (result.statusCode === 201) {
                      toast.success("Exito: ", {
                        description: result.message,
                        className: "group border-green bg-green-600 text-white",
                        position: "top-right",
                      });
                      setOpenDelete(false);
                      // router.push('/dashboard/workers');
                      // redirect('/dashboard/workers');
                    } else {
                      toast.error("Error: ", {
                        description: result.message,
                        className:
                          "destructive group border-destructive bg-destructive text-destructive-foreground",
                        position: "top-right",
                      });
                    }
                  }}
                >
                  <div className="flex mb-6 items-center justify-end">
                    <div>
                      <Button
                        type="button"
                        onClick={() => setOpenDelete(false)}
                        variant="ghost"
                      >
                        CANCELAR
                      </Button>
                    </div>
                    <div className="pl-4">
                      <Button
                        type="submit"
                        className="w-full"
                        variant="outline"
                      >
                        ELIMINAR
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <ScrollArea className="h-svh whitespace-nowrap rounded-md border">
            <DialogHeader>
              <DialogTitle>
                <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                  Crear cuenta
                </h1>
              </DialogTitle>
              <DialogDescription>
                <div>
                  <form
                    action={async (formData) => {
                      if (rolesSelected.length === 0) {
                        toast.error("Error: ", {
                          description: "Debe seleccionar al menos un rol",
                          className:
                            "destructive group border-destructive bg-destructive text-destructive-foreground",
                          position: "top-right",
                        });
                        return;
                      }
                      formData.append("roles", JSON.stringify(rolesSelected));
                      let filesObject: any[] = [];
                      if (avatar) {
                        const avatarFile = new File([avatar], "avatar.png", {
                          type: "image/png",
                        });
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
                      const result = await addWorker(
                        token,
                        formData,
                        filesObject
                      );
                      if (result.statusCode === 201) {
                        toast.success("Exito: ", {
                          description: result.message,
                          className:
                            "group border-green bg-green-600 text-white",
                          position: "top-right",
                        });
                        setOpen(false);
                        window.location.reload();
                      } else {
                        toast.error("Error: ", {
                          description: result.message,
                          className:
                            "destructive group border-destructive bg-destructive text-destructive-foreground",
                          position: "top-right",
                        });
                      }
                    }}
                  >
                    <div className="grid content-between w-full">
                      <div className="mb-3 place-self-center w-8/12">
                        <Input
                          name="userFile"
                          type="text"
                          placeholder="Numero de Legajo de Usuario"
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="place-self-center w-8/12 mb-2">
                        <div className="grid grid-rows-2 grid-flow-col place-self-center">
                          <div className="col-span-1">
                            <Input
                              name="userName"
                              type="text"
                              required
                              placeholder="Identificador de Operador"
                            />
                          </div>
                          <div className="col-span-1">
                            <Input
                              name="firstName"
                              type="text"
                              required
                              placeholder="Nombres de Operador"
                              style={{ textTransform: "uppercase" }}
                            />
                          </div>
                          <div className="row-span-2 ml-8 flex justify-center items-center">
                            <div
                              className="cursor-pointer"
                              onClick={() => setAvatarOpen(true)}
                            >
                              <img
                                style={{
                                  width: "128px",
                                  height: "128px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                                src={avatar ? avatar : "/images/noavatar.png"}
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
                      <div className="mb-3 place-self-center w-8/12">
                        <Input
                          name="lastName"
                          type="text"
                          required
                          placeholder="Apellidos de Operador"
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="mb-3 place-self-center w-8/12">
                        <Input
                          name="address"
                          type="text"
                          placeholder="Dirección del Operador"
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="mb-3 place-self-center w-8/12">
                        <Input
                          name="email"
                          type="email"
                          required
                          placeholder="Correo Electrónico"
                        />
                      </div>
                      <div className="place-self-center w-8/12">
                        <div className="grid grid-rows-2 grid-flow-col place-self-center">
                          <div className="col-span-1">
                            <Input
                              name="phone"
                              type="number"
                              placeholder="Telefono del Operador"
                            />
                          </div>
                          <div className="col-span-1">
                            <Input
                              name="password"
                              type="password"
                              required
                              placeholder="Contraseña"
                            />
                          </div>
                          <div className="row-span-2 ml-8 flex justify-center items-center">
                            <div
                              className="cursor-pointer"
                              onClick={() => setSignatureOpen(true)}
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
                      <div className="mb-3 place-self-center w-8/12">
                        <Label className="text-xs ">
                          Contraseña debe contener un mínimo de 8 caracteres,
                          <br />
                          debe contener por lo menos una letra,
                          <br />
                          debe contener por lo menos un número,
                          <br />
                          debe contener por lo menos un caracter especial
                          (@$!%*#?&)
                        </Label>
                      </div>
                      <div className="mb-3 place-self-center w-8/12">
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
                          onRemove={function noRefCheck() {}}
                          onSearch={function noRefCheck() {}}
                          onSelect={onSelectRoles}
                          options={roles}
                        />
                      </div>
                      {rolesSelected.length === 1 &&
                        rolesSelected[0].id ===
                          "865c1a3f-f48b-4135-8c2e-dc65c58229c4" && (
                          <div className="mb-3 place-self-center w-8/12">
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
                            />
                          </div>
                        )}
                      <div className="flex mb-1 items-center justify-end w-8/12">
                        <div>
                          <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant="ghost"
                          >
                            CANCELAR
                          </Button>
                        </div>
                        <div className="pl-4">
                          <Button type="submit" variant="outline">
                            CREAR CUENTA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewOperator;
