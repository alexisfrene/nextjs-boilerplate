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
import {
  MdUpdate,
  MdAdd,
  MdDelete,
  MdOutline123,
  MdOutlineAbc,
  MdEmail,
} from "react-icons/md";
import { toast } from "sonner";
import { addCustomer, deleteCustomers } from "@/lib";
import { ImageCropper } from "@/ui";
import { ScrollArea } from "@/ui";

interface paramsProps {
  selectedRows?: any;
}

function AddNewCustomer({ selectedRows }: paramsProps) {
  const [open, setOpen] = useState(false);
  const [opendel, setOpenDelete] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [logotipo, setLogotipo] = useState(null);
  const [logotipoOpen, setLogotipoOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
      } else {
        setLoading(false);
      }

      const token = session?.user?.token as string;
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
                  action={async (formData) => {
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
                    const result = await deleteCustomers(token, ids);
                    if (result.statusCode === 201) {
                      toast.success("Exito: ", {
                        description: result.message,
                        className: "group border-green bg-green-600 text-white",
                        position: "top-right",
                      });
                      setOpenDelete(false);
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
                        className="w-full"
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
                  Crear cliente
                </h1>
              </DialogTitle>
              <DialogDescription>
                <div>
                  <form
                    action={async (formData) => {
                      let filesObject = [];
                      if (logotipo) {
                        const logoFile = new File([logotipo], "signature.png", {
                          type: "image/png",
                        });
                        formData.append("files", logoFile);
                        const objetSignature = {
                          typeFile: "logotipo",
                          fileName: logoFile.name,
                        };
                        filesObject.push(objetSignature);
                      }

                      const result = await addCustomer(
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
                      <div className="place-self-center w-8/12">
                        <div className="grid grid-rows-2 grid-flow-col place-self-center">
                          <div className="col-span-1">
                            <Input
                              icon={MdOutlineAbc}
                              iconSize="text-2xl"
                              name="name"
                              type="text"
                              required
                              placeholder="Nombre del Cliente"
                              style={{ textTransform: "uppercase" }}
                            />
                          </div>
                          <div className="col-span-1">
                            <Input
                              icon={MdOutline123}
                              iconSize="text-2xl"
                              name="cuit"
                              type="number"
                              required
                              placeholder="Número de CUIT"
                            />
                          </div>
                          <div className="row-span-2 ml-8 flex justify-center items-center">
                            <div
                              className="cursor-pointer"
                              onClick={() => setLogotipoOpen(true)}
                            >
                              <img
                                style={{
                                  width: "164px",
                                  height: "164px",
                                }}
                                src={
                                  logotipo ? logotipo : "/images/logotipo.png"
                                }
                                alt="Signature"
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
                                          onClick={() => setLogotipoOpen(false)}
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
                          icon={MdOutlineAbc}
                          iconSize="text-2xl"
                          name="fiscalAddress"
                          type="text"
                          required
                          placeholder="Dirección fiscal"
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="mb-6 place-self-center w-8/12">
                        <Input
                          icon={MdOutlineAbc}
                          iconSize="text-2xl"
                          name="baseAddress"
                          type="text"
                          placeholder="Dirección base"
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div className="mb-6 place-self-center w-8/12">
                        <Input
                          icon={MdOutline123}
                          iconSize="text-2xl"
                          name="phone"
                          type="number"
                          placeholder="Telefono del Cliente"
                        />
                      </div>
                      <div className="mb-6 place-self-center w-8/12">
                        <Input
                          icon={MdEmail}
                          iconSize="text-xl"
                          name="email"
                          type="email"
                          required
                          placeholder="Correo Electrónico"
                        />
                      </div>
                      <div className="flex mb-1 items-center justify-end">
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
                            CREAR CLIENTE
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

export default AddNewCustomer;
