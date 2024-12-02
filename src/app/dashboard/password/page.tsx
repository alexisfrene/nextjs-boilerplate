"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components";
import { toast } from "sonner";
import { getUserId } from "@/lib";
import { getWorker } from "@/lib";
import { MdKey, MdUpdate } from "react-icons/md";
import { changePasswordWorker } from "@/lib";

function PasswordPage() {
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
        } else {
          toast.success("Exito: ", {
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
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div className="login-box w-1/4 h-auto shadow-md">
        <div>
          <h1 className="text-accent font-bold text-2xl text-center mb-8 mt-8">
            Cambiar Contraseña
          </h1>
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

                const result = await changePasswordWorker(token, formData);
                if (result.statusCode === 200) {
                  toast.success("Exito: ", {
                    description: result.message,
                    className: "group border-green bg-green-600 text-white",
                    position: "top-right",
                  });
                  router.push("/auth/login");
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
                <div className="mb-8 place-self-center w-8/12">
                  <Input
                    icon={MdKey}
                    iconSize="text-xl"
                    name="password"
                    type="password"
                    required
                    placeholder="Nueva contraseña"
                  />
                </div>
                <div className="mb-12 place-self-center w-8/12">
                  <Input
                    icon={MdKey}
                    iconSize="text-xl"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirmar Contraseña"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className="pl-4">
                  <Button type="submit" variant="outline">
                    GUARDAR CAMBIOS
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordPage;
