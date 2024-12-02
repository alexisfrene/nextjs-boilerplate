"use client";

import { Row } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/ui";

interface DatatableRowSelectionCellProps<TData> {
  row: Row<any>;
}

export function DatatableRowSelectionCell<TData>({
  row,
}: DatatableRowSelectionCellProps<TData>) {
  const object = row.original;
  return (
    <Checkbox
      id={object?.id}
      name={object?.id}
      key={object?.id}
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
