"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Checkbox } from "@/components";

const SignUpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords no concuerdan!");
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/auth/login");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <div className="login-box w-1/4 h-4/5 shadow-md">
        <Image
          src="/images/login_image.jpg"
          alt="Memories"
          style={{ objectFit: "contain" }}
          width={420}
          height={600}
        />
      </div>
      <div className="login-box w-1/4 h-4/5 shadow-md">
        <form onSubmit={onSubmit}>
          <h1 className="text-title font-bold text-2xl text-center mb-8 mt-4">
            Crear cuenta MEMORIES
          </h1>
          <div className="grid content-between w-full">
            <div className="mb-6 place-self-center w-7/12">
              <Input
                type="text"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Nombre de Usuario es requerido",
                  },
                })}
                placeholder="Nombre de Usuario"
              />

              {errors.username && (
                <span className="text-red-500 text-xs">
                  {errors?.username?.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <Input
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Correo Electrónico es requerido",
                  },
                })}
                placeholder="Correo Electrónico"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors?.email?.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <Input
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Contraseña es requerido",
                  },
                })}
                placeholder="Contraseña"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors?.password?.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirmación de contraseña es requerido",
                  },
                })}
                placeholder="Confirmación de contraseña"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors?.confirmPassword?.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <Input
                type="text"
                {...register("referralCode", {
                  required: false,
                })}
                placeholder="Código de referido"
              />
              {errors.referralCode && (
                <span className="text-red-500 text-sm">
                  {errors?.referralCode?.message?.toString()}
                </span>
              )}
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Link
                      className="hover:underline"
                      href="/polices/conditions"
                    >
                      Aceptar términos y condiciones
                    </Link>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Aceptas nuestros Términos de servicio y Política de
                    privacidad.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <Button type="submit" className="w-full mt-4" variant="default">
                REGISTRAR
              </Button>
            </div>
            <div className="mb-6 place-self-center w-7/12">
              <div className="text-sm text-center mb-2">
                <span>¿Ya tienes cuenta?</span>
              </div>
              <div className="text-sm text-center hover:underline">
                <Link href="/auth/login">INICIAR SESIÓN</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
