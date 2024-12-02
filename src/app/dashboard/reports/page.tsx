"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui";
import { Button, Input } from "@/components";
import {
  MdOutlineSearch,
  MdExpand,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from "react-icons/md";
import { toast } from "sonner";
import { DensityFeature, DensityState } from "../DensityFeature";
import { columns } from "./columns";
import { getSelectClosed } from "@/lib-order-works";
import { Badge } from "@/ui";

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [density, setDensity] = useState<DensityState>("sm");
  const router = useRouter();

  const [expanded, setExpanded] = useState<ExpandedState>({});

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setToken(session?.user?.token);
        await fetchWorkOrders(session?.user?.token);
      }
    })();
  }, [pagination]);

  const fetchWorkOrders = async (token: string = "") => {
    var params = {
      page: table.getState().pagination.pageIndex,
      size: table.getState().pagination.pageSize,
    };

    setLoading(true);
    const { data, workOrderList } = await getSelectClosed(
      token,
      filter,
      params
    );
    if (data.statusCode === 401) {
      toast.error("Error: ", {
        description: data.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      router.push("/auth/login");
      setLoading(false);
      return;
    }
    if (data.statusCode === 200) {
      setData(workOrderList as any);
      setTotalRows(Number(data.response.totalItems));
    } else {
      toast.error("Error: ", {
        description: data.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const table = useReactTable({
    _features: [DensityFeature],
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    rowCount: totalRows,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      density,
      expanded,
    },
    onDensityChange: setDensity,
    onExpandedChange: setExpanded,
    getSubRows: (row: any) => {
      return row.finalBalance;
    },
  });

  const handleSearchChange = (e: any) => {
    setFilter(e.target.value);
  };

  const onClickSearch = () => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setToken(session?.user?.token);
        await fetchWorkOrders(session?.user?.token);
      }
    })();
  };

  function TablePagination() {
    const pageSizes = Array.from(
      new Set([5, 10, 15, 20, table.getFilteredRowModel().rows.length])
    );

    return (
      <div className="flex items-center justify-between px-2 mt-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
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
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
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
  }

  const renderRowSubComponent = useCallback(
    ({ row }: any) => (
      <Table key="tabla2">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-emerald-600 ">Código</TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Descripción ensayo
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Detalle
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Nro. Serial
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Cantidad Orden
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Cantidad Salida
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">Saldo</TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Contacto
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Firmado
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.originalSubRows.map((row: any) => (
            <TableRow key={row.workOrderId} className="hover:bg-select-title">
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.workOrderCode}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.workOrderDescription}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.workOrderDetail}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.workOrderSerialNumber}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.amountWorkOrder}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.amountToolOutput}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.balance}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                {row.toolOutputfullName}
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                <div>
                  {row.signatureHash?.trim() == "" ? (
                    <MdCheckBoxOutlineBlank size="2.0em" />
                  ) : (
                    <MdCheckBox size="2.0em" />
                  )}
                </div>
              </TableCell>
              <TableCell
                style={{
                  padding:
                    density === "sm"
                      ? "4px"
                      : density === "md"
                      ? "8px"
                      : "16px",
                  transition: "padding 0.2s",
                }}
              >
                <div>
                  {row.status === 3 ? (
                    <Badge variant={"destructive"}>CERRADO</Badge>
                  ) : (
                    <Badge variant={"outline"}>PARCIAL</Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    []
  );

  return (
    <div className="container mx-auto py-5">
      <div className="flex items-center justify-between bg-title py-5 px-2">
        <div className="flex items-center space-x-2 mb-4">
          <form
            action={() => onClickSearch()}
            className="flex min-w-[400px] relative content-start"
          >
            <Input
              icon={MdOutlineSearch}
              id="search"
              name="search"
              type="text"
              iconSize="text-2xl"
              placeholder="Buscar por Código..."
              defaultValue={filter}
              onChange={handleSearchChange}
            />
            <Button variant="outline" className="ml-auto" type="submit">
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
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {(column.columnDef.meta as string) || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          onClick={() => table.toggleDensity()}
          className="border rounded border-accent hover:bg-select-title p-1 text-accent mb-2 w-8"
        >
          <MdExpand />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-emerald-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        padding:
                          density === "sm"
                            ? "4px"
                            : density === "md"
                            ? "8px"
                            : "16px",
                        transition: "padding 0.2s",
                        background: "#699486",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          padding:
                            density === "sm"
                              ? "4px"
                              : density === "md"
                              ? "8px"
                              : "16px",
                          transition: "padding 0.2s",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <>
                    {row.getIsExpanded() ? (
                      <TableRow key={row.id + "nested"}>
                        <TableCell
                          colSpan={columns.length - 1}
                          className="h-24 text-center"
                        >
                          {renderRowSubComponent({ row })}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {TablePagination()}
    </div>
  );
}
