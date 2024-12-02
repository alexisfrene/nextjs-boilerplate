import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Button,
  ResponsiveModal,
} from "@/components";

const WorkOrderModal = ({ open, setOpen, workOrder }: any) => {
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[80vh]">
        <ScrollArea className="whitespace-nowrap rounded-md border h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              <h1 className="text-title font-bold text-2xl text-center mb-4 bg-red-900">
                Datos de la Orden de Trabajo
              </h1>
            </DialogTitle>
            <DialogDescription>
              <form
                action={async (formData) => {
                  setOpen(false);
                }}
              >
                <div className="grid content-between">
                  <div className="flex mb-3 place-self-center w-full">
                    <div className="w-8/12 pr-4">
                      <Input
                        name="userName"
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

                <div className="flex mb-1 items-center justify-end">
                  <Button onClick={() => setOpen(false)} variant="ghost">
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </ScrollArea>
      </DialogContent>
    </ResponsiveModal>
  );
};

export default WorkOrderModal;
