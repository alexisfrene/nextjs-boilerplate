"use client";
import React, { Fragment } from "react";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import {
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { columns } from "../columns";

interface TableWorkOrdersBodyProps {
  table: TableType<any>;
}

export const TableWorkOrdersBody: React.FC<TableWorkOrdersBodyProps> = ({
  table,
}) => {
  return (
    <ScrollArea className="grid whitespace-nowrap h-[68vh]">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={headerGroup.id + index}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id + index} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <Fragment key={row.id + index}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    key={index}
                    className="uppercase"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id + index}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow key="not-result-data">
                <TableCell colSpan={columns.length} className="text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
