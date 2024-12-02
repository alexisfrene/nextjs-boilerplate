"use client";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components";
import { useFilterStore } from "@/src/global";

interface TableWorkOrdersPanelProps {
  table: Table<any>;
}

export const TableWorkOrdersPanel: React.FC<TableWorkOrdersPanelProps> = ({
  table,
}) => {
  const { filter, setFilter, setPage, setSize } = useFilterStore();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex items-center justify-between bg-title py-5 px-2">
      <div className="flex items-center space-x-2 mb-4">
        <form
          action={() => {
            setFilter(searchValue);
            setPage(0);
            setSize(5);
          }}
          className="flex min-w-[400px] relative content-start gap-1"
        >
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Buscar por Código..."
            defaultValue={filter}
            onChange={handleSearchChange}
          />
          <Button variant="outline" type="submit">
            Buscar
          </Button>
        </form>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-20">
                Mostrar/Ocultar Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table?.getAllColumns()?.length > 0 ? (
                table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {(column.columnDef.meta as string) || column.id}{" "}
                    </DropdownMenuCheckboxItem>
                  ))
              ) : (
                <div>No columns available</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
