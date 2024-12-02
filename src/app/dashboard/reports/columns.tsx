"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import {
  Badge,
  DatatableColumnHeader,
  DatatableRowSelectionHeader,
  DatatableRowSelectionCell,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";

import { WorkOrder } from "@/lib";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import ViewWorkOrder from "../work-orders/view/ViewWorkOrder";

export const columns: ColumnDef<WorkOrder>[] = [
  {
    id: "select",
    header: ({ table }) => <DatatableRowSelectionHeader table={table} />,
    cell: ({ row }) => <DatatableRowSelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    // accessorKey: "_",
    id: "expander",
    enableHiding: false,
    cell: ({ row, getValue }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        <div>
          {" "}
          {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? (
                <MdKeyboardArrowUp size={20} />
              ) : (
                <MdKeyboardArrowDown size={20} />
              )}
            </button>
          ) : (
            ""
          )}
          {""}
          {getValue<boolean>()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "code",
    meta: "Código",
    header: ({ column }) => (
      <DatatableColumnHeader title="Código" column={column} />
    ),
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
            <TooltipContent>
              <Badge>
                <div>
                  Cliente: {workOrder.customer.name} <br />
                  Cuit: {workOrder.customer.cuit} <br />
                  Dir. Fiscal: {workOrder.customer.fiscalAddress} <br />
                  Dir. Base: {workOrder.customer.baseAddress} <br />
                  Telefono: {workOrder.customer.phone} <br />
                  Email: {workOrder.customer.email}
                </div>
              </Badge>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
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
    accessorKey: "operatorId",
    meta: "Responsable",
    header: ({ column }) => (
      <DatatableColumnHeader title="Responsable" column={column} />
    ),
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-md border border-accent bg-button hover:bg-select-title hover:text-bg-black text-xs">
              {workOrder.user.lastName + " " + workOrder.user.firstName}
            </TooltipTrigger>
            <TooltipContent>
              <Badge>
                <div>
                  Usuario: {workOrder.user.userName} <br />
                  Legajo: {workOrder.user.userFile} <br />
                  Nombres: {workOrder.user.firstName} <br />
                  Apellidos: {workOrder.user.lastName} <br />
                  Dirección: {workOrder.user.address} <br />
                  Telefono: {workOrder.user.phone} <br />
                  Email: {workOrder.user.email}
                </div>
              </Badge>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "place",
    meta: "Lugar",
    header: ({ column }) => (
      <DatatableColumnHeader title="Lugar" column={column} />
    ),
  },
  {
    accessorKey: "fullName",
    meta: "Contacto",
    header: ({ column }) => (
      <DatatableColumnHeader title="Contacto" column={column} />
    ),
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-md border border-accent bg-button hover:bg-select-title hover:text-bg-black">
              Contacto
            </TooltipTrigger>
            <TooltipContent>
              {/* <Badge>{workOrder.fullName},  {workOrder.contact}</Badge> */}
              {
                <Badge>
                  <div>
                    Responsable: {workOrder.fullName} <br />
                    Contacto: {workOrder.contact}
                  </div>
                </Badge>
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "signatureHash",
    meta: "Firma",
    header: ({ column }) => (
      <DatatableColumnHeader title="Firmado" column={column} />
    ),
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <div>
          {workOrder.signatureHash?.trim() == "" ? (
            <MdCheckBoxOutlineBlank size="2.0em" />
          ) : (
            <MdCheckBox size="2.0em" />
          )}
        </div>
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
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Acción</div>,
    cell: ({ row }) => {
      const workOrder = row.original;
      return (
        <div className="flex">
          {<ViewWorkOrder workOrderId={workOrder.id} />}
        </div>
      );
    },
  },
];
