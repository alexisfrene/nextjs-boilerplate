"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DatatableColumnHeader } from "@/ui";
import EditWorkerModal from "./edit/EditOperatorModal";
import { DatatableRowSelectionHeader } from "@/ui";
import { DatatableRowSelectionCell } from "@/ui";
import { Worker } from "@/lib";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import SwitchOperator from "./switch/SwitchOperator";

export const columns: ColumnDef<Worker>[] = [
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
    accessorKey: "userFile",
    meta: "Legajo",
    header: ({ column }) => (
      <DatatableColumnHeader title="Legajo" column={column} />
    ),
  },
  {
    id: "userName",
    accessorKey: "userName",
    meta: "Nombre Usuario",
    header: ({ column }) => (
      <DatatableColumnHeader title="Nombre Usuario" column={column} />
    ),
  },
  {
    accessorKey: "lastName",
    meta: "Apellidos",
    header: ({ column }) => (
      <DatatableColumnHeader title="Apellidos" column={column} />
    ),
  },
  {
    accessorKey: "firstName",
    meta: "Nombres",
    header: ({ column }) => (
      <DatatableColumnHeader title="Nombres" column={column} />
    ),
  },
  {
    accessorKey: "address",
    meta: "Dirección",
    header: ({ column }) => (
      <DatatableColumnHeader title="Dirección" column={column} />
    ),
  },
  {
    accessorKey: "phone",
    meta: "Teléfono",
    header: () => <div className="text-center text-white">Teléfono</div>,
  },
  {
    accessorKey: "email",
    meta: "Correo",
    header: ({ column }) => (
      <DatatableColumnHeader title="Correo" column={column} />
    ),
  },
  {
    accessorKey: "status",
    meta: "Estado",
    header: ({ column }) => (
      <DatatableColumnHeader title="Habilitar/Deshabilitar" column={column} />
    ),
    cell: ({ row }) => {
      const worker = row.original;
      return (
        <div className="text-center">
          <SwitchOperator workerId={worker.id} status={worker.status} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center text-white">Acciones</div>,
    cell: ({ row }) => {
      const worker = row.original;
      return (
        <div className="flex">
          <EditWorkerModal workerId={worker.id} />
        </div>
      );
    },
  },
];
