import { create } from "zustand";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ExpandedState,
} from "@tanstack/react-table";
import { DensityState } from "@/src/app/dashboard/DensityFeature";

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  expanded: ExpandedState;
  totalRows: number;
  density: DensityState;

  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  setColumnFilters: (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void;
  setColumnVisibility: (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => void;
  setRowSelection: (
    updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  ) => void;
  setExpanded: (
    updater: ExpandedState | ((old: ExpandedState) => ExpandedState)
  ) => void;
  setTotalRows: (totalRows: number) => void;
  setDensity: (density: DensityState) => void;
}

export const useTableStore = create<TableState>((set) => ({
  sorting: [] as SortingState,
  columnFilters: [] as ColumnFiltersState,
  columnVisibility: {} as VisibilityState,
  rowSelection: {} as RowSelectionState,
  expanded: {} as ExpandedState,
  totalRows: 0,
  density: "sm",

  setSorting: (updater) =>
    set((state) => ({
      sorting:
        typeof updater === "function"
          ? (updater as (old: SortingState) => SortingState)(state.sorting)
          : updater,
    })),

  setColumnFilters: (updater) =>
    set((state) => ({
      columnFilters:
        typeof updater === "function"
          ? (updater as (old: ColumnFiltersState) => ColumnFiltersState)(
              state.columnFilters
            )
          : updater,
    })),

  setColumnVisibility: (updater) =>
    set((state) => ({
      columnVisibility:
        typeof updater === "function"
          ? (updater as (old: VisibilityState) => VisibilityState)(
              state.columnVisibility
            )
          : updater,
    })),

  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === "function"
          ? (updater as (old: RowSelectionState) => RowSelectionState)(
              state.rowSelection
            )
          : updater,
    })),

  setExpanded: (updater) =>
    set((state) => ({
      expanded:
        typeof updater === "function"
          ? (updater as (old: ExpandedState) => ExpandedState)(state.expanded)
          : updater,
    })),

  setTotalRows: (totalRows) => set({ totalRows }),
  setDensity: (density) => set({ density }),
}));
