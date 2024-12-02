import {
  ScrollArea,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  Skeleton,
} from "@/components";
import { toast } from "sonner";
import { handleForm } from "@/lib";

const PdfModal = ({
  pdfOpen,
  setPdfOpen,
  pdfFile,
  customer,
  Id,
  title,
  children,
}: any) => {
  return (
    <ResponsiveModal open={pdfOpen} onOpenChange={setPdfOpen}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
        </ResponsiveModalHeader>
        <form
          action={async (formData) => {
            formData.append("code", customer.workOrderCode);
            if (pdfFile) {
              formData.append("file", `${pdfFile}`);
            }
            const sendEmail = await handleForm(formData);
            if (sendEmail.statusCode === 200) {
              toast.success("Éxito", {
                description: sendEmail.message,
                className: "group border-green bg-green-600",
                position: "top-right",
              });
              setPdfOpen(false);
            } else {
              toast.error("Error", {
                description: sendEmail.message,
                className:
                  "destructive group border-destructive bg-destructive",
                position: "top-right",
              });
            }
          }}
        >
          <ScrollArea className="rounded-md border h-[60vh]">
            <div className="flex mb-4 place-self-center w-full">
              <div className="w-full">
                {pdfFile ? (
                  <iframe
                    id={Id}
                    name={Id}
                    title="Orden de Trabajo"
                    width="100%"
                    height="500"
                    src={`data:application/pdf;base64,${pdfFile}`}
                  />
                ) : (
                  <Skeleton className="h-[60vh] dark:bg-slate-300/60" />
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="flex gap-8">{children}</div>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default PdfModal;
