"use client";
import React, { useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ImageBg from "../../../../public/images/engineering.jpg";
import logo from "../../../../public/images/logo.png";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FloatingLabelInput,
  Label,
  LoadingButton,
} from "@/components";
import { useSessionStore } from "@/src/global";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const clearToken = useSessionStore((state) => state.clearToken);
  const token = useSessionStore((state) => state.token);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const responseNextAuth = await signIn("credentials", {
      userName: data.userName,
      password: data.password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      toast.error("Error: ", {
        description: responseNextAuth.error,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      return;
    }
    router.push("/dashboard");
  });

  return (
    <div className="grid grid-cols-6 justify-center items-center bg-gradient-to-r from-emerald-100 to-green-300 dark:from-emerald-900 dark:to-green-400 h-screen">
      <div className="flex justify-center col-span-2">
        <Image
          src={ImageBg}
          alt="Image"
          className="h-screen object-left-bottom"
        />
      </div>
      <div className="col-span-4 mx-28 mb-36">
        <div className="flex justify-center mb-3">
          <Image src={logo} alt="logo" className=" h-48 object-contain" />
        </div>
        {token && status === "authenticated" ? (
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-4xl mb-1 text-emerald-700 font-extrabold">
                Ya tienes un sesión iniciada en GM E.N.D.
              </CardTitle>
              <CardDescription className="text-center">
                Seleccionar una acción :
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Ir al inicio de la app
                </Button>
                <Button
                  onClick={() => {
                    signOut({ redirect: false });
                    clearToken();
                  }}
                  variant="destructive"
                >
                  Cerrar la session
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-right hover:underline flex justify-center w-full">
                <Label className="text-sm font-extralight text-slate-400">
                  Plataforma GM E.N.D
                </Label>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-4xl mb-1 text-emerald-700 font-extrabold">
                Bienvenido a GM E.N.D.
              </CardTitle>
              <CardDescription>
                Inicia sesión para acceder y utilizar tus datos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-x-3 gap-y-6"
              >
                <FloatingLabelInput
                  id="floating-username"
                  label="Nombre de usuario"
                  type="text"
                  {...register("userName", {
                    required: {
                      value: true,
                      message: "Nombre de Usuario es requerido",
                    },
                  })}
                />
                {errors.userName && (
                  <span className="text-red-500 text-xs">
                    {errors?.userName?.message?.toString()}
                  </span>
                )}
                <FloatingLabelInput
                  id="floating-password"
                  label="Contraseña"
                  type="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Contraseña es requerido",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors?.password?.message?.toString()}
                  </span>
                )}
                <LoadingButton
                  type="submit"
                  className="w-full mt-3"
                  loading={isSubmitting}
                >
                  <p className="w-20 ml-8">INGRESAR</p>
                </LoadingButton>
              </form>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-right hover:underline flex justify-center w-full">
                <Link href="/auth/forgot">¿Olvidaste tu contraseña?</Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
