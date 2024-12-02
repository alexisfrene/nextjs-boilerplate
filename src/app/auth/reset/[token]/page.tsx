"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { Button, Input, Label } from "@/components";
import { resetPassword } from "@/lib";

const ResetPasswordPage: React.FC = ({ params }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [svgFilePassword, setSvgFilePassword] = useState<string>(
    "/assets/icons/eye-on.svg"
  );
  const [svgFileConfirmPassword, setSvgFileConfirmPassword] = useState<string>(
    "/assets/icons/eye-on.svg"
  );

  const [tokenPassword, setTokenPassword] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
    setTokenPassword(params.token);
  }, [params.token]);

  const onClickEyePassword = () => {
    if (showPassword) {
      setSvgFilePassword("/assets/icons/eye-on.svg");
    } else {
      setSvgFilePassword("/assets/icons/eye-off.svg");
    }
    setShowPassword(!showPassword);
  };

  const onClickEyeConfirmPassword = () => {
    if (showConfirmPassword) {
      setSvgFileConfirmPassword("/assets/icons/eye-on.svg");
    } else {
      setSvgFileConfirmPassword("/assets/icons/eye-off.svg");
    }
    setshowConfirmPassword(!showConfirmPassword);
  };

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true)
  //     const session = await getSession();
  //     if (!session) {
  //       router.push('/auth/login');
  //       return;
  //     } else {
  //       const token = session.user.token as string;
  //       setToken(token);
  //       const workerId = await getUserId(token);
  //       const result = await getWorker(token, workerId);
  //       if (result.statusCode === 401) {
  //         toast.error("Error: ", {
  //           description: result.message,
  //           className: "destructive group border-destructive bg-destructive text-destructive-foreground",
  //           position: "top-right"
  //         });
  //         router.push("/auth/login");
  //         setLoading(false);
  //         return;
  //       }
  //       if (result.statusCode === 200) {
  //         setWorker(result.response.items);
  //       } else {
  //         toast.success("Exito: ", {
  //           description: result.message,
  //           className: "destructive group border-destructive bg-destructive text-destructive-foreground",
  //           position: "top-right"
  //         });
  //       }
  //       setLoading(false)
  //     }
  //   })();
  // }, []);

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

                const result = await resetPassword(
                  tokenPassword,
                  password as string
                );
                if (result.statusCode === 200) {
                  toast.success("Éxito: ", {
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
                    name="password"
                    type="password"
                    required
                    placeholder="Nueva contraseña"
                  />
                  <div className="relative">
                    <div className="absolute -translate-y-8 inset-y-0 end-0 flex items-center ps-1">
                      <input
                        type="checkbox"
                        id="toggle"
                        className="hidden js-password-toggle"
                      />
                      <label
                        htmlFor="toggle"
                        className="px-2 text-gray-500 cursor-pointer js-password-label flex
                         items-center justify-center"
                      >
                        <span className="absolute right-0 grid w-12 h-full transition-colors place-items-center bg-light-blue-600 group-hover:bg-light-blue-700">
                          <Image
                            src={svgFilePassword}
                            alt="password"
                            className="w-6 h-6"
                            onClick={onClickEyePassword}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-1 place-self-center w-full">
                    <Label className="text-xs ">
                      Contraseña debe contener un mínimo de 8 caracteres,
                      <br />
                      debe contener por lo menos una letra,
                      <br />
                      debe contener por lo menos un número,
                      <br />
                      debe contener por lo menos un carácter especial (@$!%*#?&)
                    </Label>
                  </div>
                </div>
                <div className="mb-12 place-self-center w-8/12">
                  <Input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirmar Contraseña"
                  />
                  <div className="relative">
                    <div className="absolute -translate-y-8 inset-y-0 end-0 flex items-center ps-1">
                      <input
                        type="checkbox"
                        id="toggle"
                        className="hidden js-password-toggle"
                      />
                      <label
                        htmlFor="toggle"
                        className="px-2 text-gray-500 cursor-pointer js-password-label flex
                         items-center justify-center"
                      >
                        <span className="absolute right-0 grid w-12 h-full transition-colors place-items-center bg-light-blue-600 group-hover:bg-light-blue-700">
                          <Image
                            src={svgFileConfirmPassword}
                            alt="password"
                            className="w-6 h-6"
                            onClick={onClickEyeConfirmPassword}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center mb-8">
                <div className="pl-4">
                  <Button type="submit" variant="outline">
                    RESTABLECER CONTRASEÑA
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
