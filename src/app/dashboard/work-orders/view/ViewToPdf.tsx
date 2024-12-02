"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Input } from "@/components";
import { toast } from "sonner";
import { MdOutlineFilePresent } from "react-icons/md";
import { getToolOutputPdf, handleForm } from "@/lib";

import PdfModal from "./PdfModal";

function ViewToolOutputPdf({ toolOutputId, customer }: any) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

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

  function handleClickPdf(toId: string) {
    setPdfOpen(true);
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setLoading(false);
      }

      const result = await getToolOutputPdf(token, toId);
      if (result.statusCode === 200) {
        setPdfFile(result.response as any);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        toast.error("Error: ", {
          description: (result.message as any).toString(),
          className:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
          position: "top-right",
        });
      }
    })();
  }

  return (
    <div className="flex">
      <Button
        onClick={() => handleClickPdf(toolOutputId)}
        variant="outline"
        className="place-self-center"
        size="icon"
      >
        <MdOutlineFilePresent size="2.0em" />
      </Button>
      <PdfModal
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        pdfFile={pdfFile}
        customer={customer}
        Id={toolOutputId}
        title="Salida de Herramientas"
      >
        <form
          action={async (formData) => {
            formData.append("code", customer.workOrderCode);
            if (pdfFile) {
              formData.append("file", `${pdfFile}`);
            }
            const sendEmail = await handleForm(formData);
            if (sendEmail.statusCode === 200) {
              toast.success("Éxito: ", {
                description: sendEmail.message,
                className: "group border-green bg-green-600",
                position: "top-right",
              });
              setPdfOpen(false);
            } else {
              toast.error("Error: ", {
                description: sendEmail.message,
                className:
                  "destructive group border-destructive bg-destructive text-destructive-foreground",
                position: "top-right",
              });
            }
          }}
        >
          <div className="flex gap-1 mb-2">
            <div className="w-2/4">
              <Input
                name="content"
                type="text"
                required
                defaultValue={customer?.content}
                placeholder="Mensaje a enviar"
              />
            </div>
            <div className="w-2/4">
              <Input
                name="name"
                type="text"
                defaultValue={customer?.name}
                readOnly={true}
                required
                placeholder="Nombre de Cliente"
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-3/5">
              <Input
                name="email"
                type="email"
                defaultValue={customer?.email}
                required
                placeholder="Correo Electrónico"
              />
            </div>
            <div className="flex mb-1 items-center justify-end">
              <div className="ml-10">
                <Button type="submit" variant="outline">
                  Enviar
                </Button>
              </div>
              <div className="ml-10">
                <Button onClick={() => setPdfOpen(false)} variant="ghost">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </PdfModal>
    </div>
  );
}

export default ViewToolOutputPdf;
