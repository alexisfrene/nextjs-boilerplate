"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui";
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
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
import { toast } from "sonner";

import { columns } from "./columns";
import { getWorkers } from "@/lib";
import AddNewOperator from "./add/AddNewOperator";

import { MdExpand } from "react-icons/md";
import { DensityFeature, DensityState } from "../DensityFeature";
import ViewWorkOrder from "../work-orders/view/ViewWorkOrder";

export default function OperatorsPage() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [density, setDensity] = useState<DensityState>("sm");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        setToken(session?.user?.token);
        await fetchWorkers(session?.user?.token);
      }
    })();
  }, [pagination]);

  const fetchWorkers = async (token = "") => {
    var params = {
      page: myTable.getState().pagination.pageIndex,
      size: myTable.getState().pagination.pageSize,
    };

    setLoading(true);
    const workers = await getWorkers(token, filter, params);
    if (workers.statusCode === 401) {
      toast.error("Error: ", {
        description: workers.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      setLoading(false);
      router.push("/auth/login");
      return;
    }
    if (workers.statusCode === 429) {
      toast.error("Error: ", {
        description: workers.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      setLoading(false);
      router.push("/auth/login");
      return;
    }
    if (workers.statusCode === 200) {
      setData(workers.response.items);
      setTotalRows(Number(workers.response.totalItems));
    } else {
      toast.error("Error: ", {
        description: workers.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
    }
    setLoading(false);
  };

  const myTable = useReactTable({
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
    onDensityChange: setDensity,
    onExpandedChange: setExpanded,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      density,
      expanded,
    },
    getSubRows: (row: any) => {
      return row.workOrders;
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
        await fetchWorkers(session?.user?.token);
      }
    })();
  };

  function TablePagination() {
    const pageSizes = Array.from(
      new Set([5, 10, 15, 20, myTable.getFilteredRowModel().rows.length])
    );

    return (
      <div className="flex items-center justify-between px-2 mt-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {myTable.getFilteredSelectedRowModel().rows.length} of{" "}
          {myTable.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {myTable.getState().pagination.pageIndex + 1} de{" "}
            {myTable.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => myTable.setPageIndex(0)}
              disabled={!myTable.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => myTable.previousPage()}
              disabled={!myTable.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => myTable.nextPage()}
              disabled={!myTable.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => myTable.setPageIndex(myTable.getPageCount() - 1)}
              disabled={!myTable.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>
          <div className="flex items-center px-4">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={`${myTable.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                myTable.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={myTable.getState().pagination.pageSize}
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
            <TableHead className="bg-emerald-600 text-bg-txt">Codigo</TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Cliente
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">Lugar</TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">Cuit</TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Direccion Fiscal
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">
              Telefono
            </TableHead>
            <TableHead className="bg-emerald-600 text-bg-txt">Accion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {row.originalSubRows.map((row: any) => (
            <TableRow key={row.id} className="hover:bg-select-title">
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.cuit}</TableCell>
              <TableCell>{row.fiscalAddress}</TableCell>
              <TableCell>{row.baseAddress}</TableCell>
              <TableCell>
                <ViewWorkOrder workOrderId={row.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    []
  );

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between bg-title py-5 px-2">
          <div className="flex items-center space-x-2 mb-4 bg-title">
            <form
              action={() => onClickSearch()}
              className="flex min-w-[400px] relative content-start gap-1"
            >
              <Input
                id="search"
                name="search"
                type="text"
                placeholder="Filtrar operadores..."
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
                  {myTable
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
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
            onClick={() => myTable.toggleDensity()}
            className="border rounded border-accent hover:bg-select-title p-1 text-accent mb-2 w-8"
          >
            <MdExpand />
          </Button>
          <div className="content-end">
            <AddNewOperator
              selectedRows={myTable.getFilteredSelectedRowModel().rows}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {myTable.getHeaderGroups().map((headerGroup) => (
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
              {myTable.getRowModel().rows?.length ? (
                myTable.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            //using our new feature in the code
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
      </CardContent>
    </Card>
  );
}
