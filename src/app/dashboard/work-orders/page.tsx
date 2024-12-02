"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { Card, CardContent, Skeleton } from "@/components";
import { TableWorkOrdersPanel } from "./TableWorkOrdersPanel";
import { TableWorkOrdersBody } from "./TableWorkOrdersBody";
import { TableWorkOrdersFooter } from "./TableWorkOrdersFooter";
import { getSelectAll } from "@/src/lib/data-order-works";
import { useFilterStore, useTableStore } from "@/src/global";
import { columns } from "./columns";

export default function WorkOrdersPage() {
  const { data: session } = useSession();
  const { filter, page, size, setPage, setSize } = useFilterStore();
  const columnsMemo = useMemo(() => columns, []);
  const {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    expanded,
    totalRows,
    density,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setExpanded,
    setTotalRows,
  } = useTableStore();

  const query = useQuery({
    queryKey: ["work-orders", filter, page, size],
    queryFn: async () => {
      const res = await getSelectAll({
        token: session?.user.token!,
        filter,
        params: {
          page,
          size,
        },
      });
      setTotalRows(Number(res.data.totalItems));

      return res.workOrderList;
    },
    enabled: !!session?.user.token!,
  });

  const table = useReactTable({
    data: query.data as any,
    columns: columnsMemo,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    enableRowSelection: true,
    rowCount: totalRows,
    state: {
      pagination: { pageIndex: page, pageSize: size },
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      density,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: page, pageSize: size })
          : updater;

      setPage(newState.pageIndex);
      setSize(newState.pageSize);
      query.refetch();
    },
  });
  if (query.isPending)
    return (
      <div className="m-3">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-14 mt-6" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
        <Skeleton className="w-full h-14 mt-3" />
      </div>
    );

  return (
    <Card>
      <CardContent>
        <TableWorkOrdersPanel table={table} />
        <TableWorkOrdersBody table={table} />
        <TableWorkOrdersFooter table={table} />
      </CardContent>
    </Card>
  );
}
