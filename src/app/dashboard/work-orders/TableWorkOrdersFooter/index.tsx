"use client";
import { Table as TableType } from "@tanstack/react-table";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useFilterStore } from "@/src/global";

interface TableWorkOrdersFooterProps {
  table: TableType<any>;
}

export const TableWorkOrdersFooter: React.FC<TableWorkOrdersFooterProps> = ({
  table,
}) => {
  const { filter, page, size, setPage, setSize } = useFilterStore();
  const pageSizes = Array.from(
    new Set([5, 10, 15, 20, table.getFilteredRowModel().rows.length])
  );

  return (
    <div className="flex items-center justify-between px-2 mt-2">
      <div className="flex items-center">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="border rounded p-3 text-xl"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            className="border rounded p-3 text-xl"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            className="border rounded p-3 text-xl"
            variant="outline"
            onClick={() => {
              const newPageIndex = table.getState().pagination.pageIndex + 1;
              table.setPageIndex(newPageIndex);
            }}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            className="border rounded p-3 text-xl"
            variant="outline"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              setPage(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <div className="flex items-center px-4">
          <p className="text-sm font-medium">Filas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value: any) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
