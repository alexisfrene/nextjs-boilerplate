"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DatatableColumnHeader,
  Badge,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Select,
} from "@/components";
import { WorkOrder } from "@/lib";
import ViewWorkOrder from "./view/ViewWorkOrder";
import ViewOperationPartPdf from "./view/ViewOpPdf";
import ViewToolOutputPdf from "./view/ViewToPdf";
import ViewPreticketPdf from "./view/ViewPtPdf";

let operPartId = "-1";
let toolOut = "-1";
let preticket = "-1";

const handleChangeOperationPart = (event: any) => {
  // const selectedIndex = event.target.options.selectedIndex;
  // console.log(event.target.options[selectedIndex].getAttribute('data-key'));
  operPartId = event as string;
};

const handleChangeToolOutput = (event: any) => {
  toolOut = event as string;
  console.log(toolOut);
};

const handelChangePreticket = (event: any) => {
  preticket = event as string;
  console.log(preticket);
};

const handleLoadFinalReport = (workOrderId: string) => {
  console.log("workOrderId: " + workOrderId);
};

const handleLoadInvoice = (workOrderId: string) => {
  console.log("workOrderId: " + workOrderId);
};

export const columns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: "workOrderDate",
    meta: "Fecha",
    header: ({ column }) => (
      <DatatableColumnHeader title="Fecha" column={column} />
    ),
    sortingFn: (
      rowA: Row<WorkOrder>,
      rowB: Row<WorkOrder>,
      columnId: string
    ) => {
      if (
        rowA.original.workOrderDate !== undefined &&
        rowB.original.workOrderDate !== undefined
      ) {
        let valueA = rowA.original.workOrderDate.replace("/", "");
        valueA = valueA.split("").reverse().join("");
        let valueB = rowB.original.workOrderDate.replace("/", "");
        valueB = valueB.split("").reverse().join("");
        return ("" + valueA).localeCompare(valueB);
      }
      return 0;
    },
  },
  {
    accessorKey: "code",
    meta: "Código",
    header: ({ column }) => (
      <DatatableColumnHeader title="Código" column={column} />
    ),
  },
  {
    id: "workOrderPdf",
    enableHiding: false,
    header: () => <div></div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <div className="-ml-10">
          <ViewWorkOrder workOrderId={workOrder.id} />
        </div>
      );
    },
  },
  {
    accessorKey: "customerId",
    meta: "Cliente",
    header: ({ column }) => (
      <DatatableColumnHeader title="Cliente" column={column} />
    ),
    sortingFn: (
      rowA: Row<WorkOrder>,
      rowB: Row<WorkOrder>,
      columnId: string
    ) => {
      if (
        rowA.original.customer !== undefined &&
        rowB.original.customer !== undefined
      ) {
        return ("" + rowA.original.customer.name).localeCompare(
          rowB.original.customer.name
        );
      }

      return 0;
    },
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-md border border-accent bg-button hover:bg-select-title hover:text-bg-black">
              {workOrder.customer.name.length > 30
                ? workOrder.customer.name.substring(0, 30) + "..."
                : workOrder.customer.name}
            </TooltipTrigger>
            <TooltipContent className="rounded-md">
              <div>
                Cliente: {workOrder.customer.name || "-"} <br />
                CUIT: {workOrder.customer.cuit || "-"} <br />
                Dir. Fiscal: {workOrder.customer.fiscalAddress || "-"} <br />
                Dir. Base: {workOrder.customer.baseAddress || "-"} <br />
                Teléfono: {workOrder.customer.phone || "-"} <br />
                Email: {workOrder.customer.email || "-"}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "status",
    meta: "Estado",
    header: ({ column }) => (
      <DatatableColumnHeader title="Estado" column={column} />
    ),
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <div>
          {workOrder.status === 3 ? (
            <Badge variant={"destructive"}>CERRADO</Badge>
          ) : workOrder.status === 2 ? (
            <Badge variant={"partial"}>PARCIAL</Badge>
          ) : (
            <Badge variant={"active"}>ACTIVO</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "operationPart",
    meta: "Parte de Operaciones",
    header: () => <div className="text-center  ">Parte de Operaciones</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <>
          {workOrder.operationPart.length > 0 && (
            <div className="flex gap-2">
              <Select
                onValueChange={handleChangeOperationPart}
                // onChange = {() => {operPartId = parseInt(event.target.value)}}
                // onValueChange = {(value) => {operPartId = parseInt(value)}}
              >
                <SelectTrigger className="w-[150px] justify-between">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {workOrder.operationPart.map((operationPart) => (
                      <SelectItem
                        key={operationPart.id}
                        value={operationPart.id.toString()}
                      >
                        {operationPart.code.toString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <ViewOperationPartPdf operationPartId={ `${operPartId}` } customer={workOrder.customer} /> */}
              <ViewOperationPartPdf
                operationPartId={workOrder.operationPart[0].id}
                customer={workOrder.customer}
              />
            </div>
          )}
        </>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "toolOutput",
    meta: "Salida Herramientas",
    header: () => <div className="text-center  ">Salida Herramientas</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <>
          {workOrder.toolOutput.length > 0 && (
            <div className="flex gap-2">
              <Select onValueChange={handleChangeToolOutput}>
                <SelectTrigger className="w-[150px] justify-between">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {workOrder.toolOutput.map((toolOutput, i) => (
                      <SelectItem
                        key={toolOutput.id + i}
                        value={toolOutput.code.toString()}
                      >
                        {toolOutput.code.toString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ViewToolOutputPdf
                toolOutputId={workOrder.toolOutput[0].id}
                customer={workOrder.customer}
              />
            </div>
          )}
        </>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "load",
    meta: "Carga Informe Final",
    header: () => <div className="text-center  ">Carga Informe Final</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <>
          {workOrder.toolOutput.length > 0 && (
            <Button
              onClick={() => handleLoadFinalReport(workOrder.id)}
              className="w-full"
              variant="outline"
            >
              Informe Final
            </Button>
          )}
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "preticket",
    meta: "Preticket",
    header: () => <div className="text-center  ">Preticket</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <>
          {workOrder.preticket.length > 0 && (
            <div className="flex gap-2">
              <Select onValueChange={handelChangePreticket}>
                <SelectTrigger className="w-[150px] justify-between">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {workOrder.preticket.map((preticket) => (
                      <SelectItem
                        key={preticket.id}
                        value={preticket.code.toString()}
                      >
                        {preticket.code.toString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ViewPreticketPdf
                preticketId={workOrder.preticket[0].id}
                customer={workOrder.customer}
              />
            </div>
          )}
        </>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "toolOutput",
    meta: "Carga Factura",
    header: () => <div className="text-center  ">Carga Factura</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <>
          {workOrder.toolOutput.length > 0 && (
            <Button
              onClick={() => handleLoadInvoice(workOrder.id)}
              className="w-full"
              variant="outline"
            >
              Factura
            </Button>
          )}
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
