"use client";

import { Table } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/ui";

interface DatatableRowSelectionHeaderProps<TData> {
  table: Table<TData>;
}

export function DatatableRowSelectionHeader<TData>({
  table,
}: DatatableRowSelectionHeaderProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}
