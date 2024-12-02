"use client";
import React from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingButton,
  FloatingLabelInput,
} from "@/ui";
import { forgotPassword } from "@/lib";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleForgot = () => {
    (async () => {
      setLoading(true);
      const result = await forgotPassword(email);
      if (result.statusCode !== 200) {
        toast.error("Error: ", {
          description: result.message,
          className:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
          position: "top-right",
        });
        return;
      }
      if (result.statusCode === 200) {
        toast.success("Éxito: ", {
          description: result.message,
          className: "group border-green bg-green-600 text-white",
          position: "top-right",
        });
      }
    })();
    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-emerald-100 to-green-300 dark:from-emerald-900 dark:to-green-400">
      <Card>
        <CardHeader>
          <CardTitle>Olvide mi contraseña</CardTitle>
          <CardDescription>
            Te enviaremos un correo electrónico para validar que seas el
            propietario de la cuenta :
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleForgot}>
            <FloatingLabelInput
              type="email"
              name="email"
              id="floating-email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <LoadingButton
              type="submit"
              className="w-full mt-6"
              loading={loading}
            >
              <p className="w-12">Enviar</p>
            </LoadingButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
