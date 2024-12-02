"use client";
import {
  SidebarProvider,
  SidebarTrigger,
  AppSidebar,
  ModeToggle,
} from "@/components";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="w-full bg-gradient-to-r from-emerald-200 to-emerald-400 dark:from-emerald-600 dark:to-emerald-300 flex justify-between h-[4.7rem] items-center px-3">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
