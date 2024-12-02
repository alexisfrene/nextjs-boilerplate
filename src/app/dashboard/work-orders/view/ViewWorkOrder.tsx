"use client";
import { toast } from "sonner";
import { MdOutlineFilePresent } from "react-icons/md";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, FloatingLabelInput, Input } from "@/components";
import {
  getCustomerFromWorkOrdeId,
  getWorkOrder,
  getWorkOrderPdf,
} from "@/lib";
import { WorkOrder } from "@/lib";

import WorkOrderModal from "./WorkOrderModal";
import PdfModal from "./PdfModal";

interface workOrderIdProps {
  workOrderId: string;
}

const ViewWorkOrder: React.FC<workOrderIdProps> = ({ workOrderId }) => {
  const [open, setOpen] = useState(false);
  const [workOrder, setWorkOrder] = useState({} as WorkOrder);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    cuit: "",
    fiscalAddress: "",
    baseAddress: "",
    phone: "",
    email: "",
    content: "",
    workOrderCode: "",
  });

  // UseEffect para obtener la sesión y el token
  useEffect(() => {
    const loadSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }
      setToken(session?.user?.token);
      setLoading(false);
    };
    loadSession();
  }, [router]);

  // Obtener información de la orden de trabajo
  const handleClickInfo = async (workOrderId: string) => {
    setOpen(true);
    const result = await getWorkOrder(token, workOrderId);
    if (result.statusCode === 200) {
      setWorkOrder(result.response);
    } else {
      toast.error("Error: ", {
        description: result.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
    }
  };

  // Obtener PDF de la orden de trabajo
  const handleClickPdf = async (woId: string) => {
    setPdfOpen(true);
    const result = await getWorkOrderPdf(token, woId);
    if (result.statusCode === 200) {
      setPdfFile(result.response as any);
      await new Promise((r) => setTimeout(r, 3000));
      const customerResult = await getCustomerFromWorkOrdeId(token, woId);
      if (customerResult.statusCode === 200) {
        setCustomer(customerResult.response);
      }
    } else {
      toast.error("Error: ", {
        description: (result.message as any).toString(),
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex">
      <Button
        onClick={() => handleClickPdf(workOrderId)}
        variant="outline"
        className="place-self-center"
        size="icon"
      >
        <MdOutlineFilePresent size="2.0em" />
      </Button>
      <WorkOrderModal open={open} setOpen={setOpen} workOrder={workOrder} />
      <PdfModal
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        pdfFile={pdfFile}
        customer={customer}
        Id={workOrderId}
        title={"Orden de Trabajo"}
      >
        <form
          action={async (formData) => {
            setOpen(false);
          }}
        >
          {/* Datos generales de la orden */}
          <div className="grid content-between">
            <div className="flex mb-3 place-self-center w-full">
              <div className=" pr-4">
                <FloatingLabelInput
                  name="userName"
                  id="userName"
                  defaultValue={workOrder.code}
                  readOnly
                  type="text"
                  required
                  placeholder="Código"
                />
              </div>
              <div className="w-8/12">
                <Input
                  name="firstName"
                  defaultValue={workOrder.place}
                  readOnly
                  type="text"
                  required
                  placeholder="Lugar de trabajo"
                />
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid content-between">
            <div className="flex mb-3 place-self-center w-full">
              <div className="w-8/12 pr-4">
                <Input
                  name="name"
                  defaultValue={workOrder.customer?.name}
                  readOnly
                  type="text"
                  required
                  placeholder="Cliente"
                />
              </div>
              <div className="w-8/12">
                <Input
                  name="fiscalAddress"
                  defaultValue={workOrder.customer?.fiscalAddress}
                  readOnly
                  type="text"
                  required
                  placeholder="Dirección Fiscal"
                />
              </div>
            </div>
          </div>

          {/* Sección final */}
          <div className="flex mb-1 items-center justify-end">
            <Button onClick={() => setOpen(false)} variant="ghost">
              Cancelar
            </Button>
          </div>
        </form>
      </PdfModal>
    </div>
  );
};

export default ViewWorkOrder;
