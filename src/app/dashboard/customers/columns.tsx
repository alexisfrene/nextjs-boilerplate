"use client";

import { ColumnDef } from "@tanstack/react-table";

import EditCustomerModal from "./edit/EditCustomerModal";
import SwitchCustomer from "./switch/SwitchCustomer";
import {
  DatatableColumnHeader,
  DatatableRowSelectionCell,
  DatatableRowSelectionHeader,
} from "@/ui";

export type Customer = {
  id: string;
  name: string;
  cuit: string;
  fiscalAddress: string;
  baseAddress: string;
  phone: string;
  email: string;
  status: number;
};

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => <DatatableRowSelectionHeader table={table} />,
    cell: ({ row }) => <DatatableRowSelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    meta: "Cliente",
    header: ({ column }) => (
      <DatatableColumnHeader title="Cliente" column={column} />
    ),
  },
  {
    accessorKey: "cuit",
    meta: "Cuit",
    header: ({ column }) => (
      <DatatableColumnHeader title="Cuit" column={column} />
    ),
  },
  {
    accessorKey: "fiscalAddress",
    meta: "Dirección Fiscal",
    header: ({ column }) => (
      <DatatableColumnHeader title="Dirección Fiscal" column={column} />
    ),
  },
  {
    accessorKey: "baseAddress",
    meta: "Dirección Base",
    header: ({ column }) => (
      <DatatableColumnHeader title="Dirección Base" column={column} />
    ),
  },
  {
    accessorKey: "phone",
    meta: "Teléfono",
    header: () => (
      <div className="fontWeight: 'bold' text-center text-white">Teléfono</div>
    ),
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
      const customer = row.original;
      return (
        <div className="text-center">
          <SwitchCustomer customerId={customer.id} status={customer.status} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center text-white">Acción</div>,
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex">
          {<EditCustomerModal customerId={customer.id} />}
        </div>
      );
    },
  },
];
