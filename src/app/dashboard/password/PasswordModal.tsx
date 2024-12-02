"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui";
import { Button, Input } from "@/components";
import { toast } from "sonner";
import { getWorker } from "@/lib";
import { getUserId } from "@/lib";
import { changePasswordWorker } from "@/lib";
import { MdUpdate } from "react-icons/md";

function PasswordModal() {
  const [open, setOpen] = useState(false);
  const [worker, setWorker] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        const token = session.user.token as string;
        setToken(token);
        const workerId = await getUserId(token);
        const result = await getWorker(token, workerId);
        if (result.statusCode === 401) {
          toast.error("Error: ", {
            description: result.message,
            className:
              "destructive group border-destructive bg-destructive text-destructive-foreground",
            position: "top-right",
          });
          router.push("/auth/login");
          setLoading(false);
          return;
        }
        if (result.statusCode === 200) {
          setWorker(result.response.items);
          setOpen(true);
        } else {
          toast.success("Éxito: ", {
            description: result.message,
            className:
              "destructive group border-destructive bg-destructive text-destructive-foreground",
            position: "top-right",
          });
        }
        setLoading(false);
      }
    })();
  }, []);

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
    <>
      <div className="flex">
        <Dialog open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <h1 className="text-title font-bold text-2xl text-center mb-4 mt-1">
                  Cambiar Contraseña
                </h1>
              </DialogTitle>
              <DialogDescription>
                <div>
                  <form
                    action={async (formData) => {
                      const password = formData.get("password");
                      const confirmPassword = formData.get("confirmPassword");
                      if (password !== confirmPassword) {
                        toast.error("Error: ", {
                          description: "Las contraseñas no coinciden",
                          className:
                            "destructive group border-destructive bg-destructive text-destructive-foreground",
                          position: "top-right",
                        });
                        return;
                      }

                      const result = await changePasswordWorker(
                        token,
                        formData
                      );
                      if (result.statusCode === 201) {
                        toast.success("Éxito: ", {
                          description: result.message,
                          className:
                            "group border-green bg-green-600 text-white",
                          position: "top-right",
                        });
                        setOpen(false);
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
                      <div className="mb-6 place-self-center w-8/12">
                        <Input
                          name="password"
                          type="password"
                          required
                          placeholder="Contraseña"
                        />
                      </div>
                      <div className="mb-6 place-self-center w-8/12">
                        <Input
                          name="confirmPassword"
                          type="password"
                          required
                          placeholder="Confirmar Contraseña"
                        />
                      </div>
                    </div>
                    <div className="flex mb-1 items-center justify-end">
                      <div>
                        <Button onClick={() => setOpen(false)} variant="ghost">
                          CANCELAR
                        </Button>
                      </div>
                      <div className="pl-4">
                        <Button type="submit" variant="outline">
                          GUARDAR CAMBIOS
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default PasswordModal;