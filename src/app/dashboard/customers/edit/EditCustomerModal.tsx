"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui";
import { Button, Input } from "@/components";
import { toast } from "sonner";
import { MdInfoOutline, MdModeEdit } from "react-icons/md";
import { Customer } from "@/lib";
import { editCustomer } from "@/lib";
import { getCustomer } from "@/lib";
import { ImageCropper } from "@/ui";
import { ScrollArea } from "@/ui";
import Image from "next/image";

function EditCustomerModal({ customerId }: any) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({} as Customer);
  const [token, setToken] = useState("");
  const [editInfo, setEditInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [logotipo, setLogotipo] = useState(null);
  const [logotipoOpen, setLogotipoOpen] = useState(false);

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
    })();
  }, []);

  const updateLogotipo = (imgSrc: any) => {
    setLogotipo(imgSrc);
  };

  const saveLogotipo = (imgSrc: any) => {
    setLogotipo(imgSrc);
    setLogotipoOpen(false);
  };

  function handleClickEdit(customerId: string, edit: boolean) {
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
      const result = await getCustomer(token, customerId);
      if (result.statusCode === 200) {
        setCustomer(result.response);
        setLogotipo(result.response.logo);
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

  return (
    <>
      <div className="flex">
        <Button
          onClick={() => handleClickEdit(customerId, false)}
          variant="outline"
          className="place-self-center"
        >
          <MdInfoOutline className="h-4 w-4" size={6} />
        </Button>
        <Button
          onClick={() => handleClickEdit(customerId, true)}
          variant="outline"
          className="place-self-center"
        >
          <MdModeEdit className="h-4 w-4 p-0" size={6} />
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <ScrollArea className="h-svh whitespace-nowrap rounded-md border">
              <DialogHeader>
                <DialogTitle>
                  <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                    {editInfo ? (
                      <>Modificar Datos</>
                    ) : (
                      <>Información del Cliente</>
                    )}
                  </h1>
                </DialogTitle>
                <DialogDescription>
                  <div>
                    <form
                      action={async (formData) => {
                        if (editInfo) {
                          let filesObject = [];
                          if (logotipo) {
                            const logoFile = new File(
                              [logotipo],
                              "logotipo.png",
                              { type: "image/png" }
                            );
                            formData.append("files", logoFile);
                            const objetLogotipo = {
                              typeFile: "logotipo",
                              fileName: logoFile.name,
                            };
                            filesObject.push(objetLogotipo);
                          }
                          const result = await editCustomer(
                            token,
                            customerId,
                            formData,
                            filesObject
                          );
                          if (result.statusCode === 200) {
                            toast.success("Éxito: ", {
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
                          <div className="grid grid-rows-2 grid-flow-col place-self-center">
                            <div className="col-span-1">
                              <Input
                                name="name"
                                type="text"
                                defaultValue={customer.name}
                                readOnly={!editInfo}
                                required
                                placeholder="Nombre del Cliente"
                              />
                            </div>
                            <div className="col-span-1">
                              <Input
                                name="cuit"
                                type="text"
                                defaultValue={customer.cuit}
                                readOnly={!editInfo}
                                required
                                placeholder="Numero de CUIT"
                              />
                            </div>
                            <div className="row-span-2 ml-8 flex justify-center items-center">
                              <div
                                className="cursor-pointer"
                                onClick={
                                  editInfo
                                    ? () => setLogotipoOpen(true)
                                    : undefined
                                }
                              >
                                <Image
                                  style={{
                                    width: "164px",
                                    height: "164px",
                                  }}
                                  src={
                                    logotipo ? logotipo : "/images/logotipo.png"
                                  }
                                  alt="Logo"
                                />
                              </div>
                              <Dialog open={logotipoOpen}>
                                <DialogContent>
                                  <DialogTitle>
                                    <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                                      Subir Firma
                                    </h1>
                                  </DialogTitle>
                                  <ImageCropper
                                    updateImage={updateLogotipo}
                                    onSave={saveLogotipo}
                                  />
                                  <DialogFooter className="sm:justify-end">
                                    <DialogClose>
                                      <div className="flex mb-1 items-center justify-end">
                                        <div>
                                          <Button
                                            onClick={() =>
                                              setLogotipoOpen(false)
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
                          <Input
                            name="fiscalAddress"
                            defaultValue={customer.fiscalAddress}
                            readOnly={!editInfo}
                            type="text"
                            placeholder="Dirección fiscal"
                            required
                          />
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="baseAddress"
                            defaultValue={customer.baseAddress}
                            readOnly={!editInfo}
                            placeholder="Dirección base"
                            type="text"
                          />
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="phone"
                            type="text"
                            defaultValue={customer.phone}
                            readOnly={!editInfo}
                            placeholder="Teléfono del Cliente"
                          />
                        </div>
                        <div className="mb-6 place-self-center w-8/12">
                          <Input
                            name="email"
                            defaultValue={customer.email}
                            readOnly={!editInfo}
                            placeholder="Correo Electrónico"
                            type="email"
                          />
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
      </div>
    </>
  );
}

export default EditCustomerModal;
