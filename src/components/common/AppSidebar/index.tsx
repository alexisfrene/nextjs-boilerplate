"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MdBrightness5,
  MdOutlineDirectionsWalk,
  MdAccountBalance,
  MdOutlinePersonalVideo,
} from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components";
import { cn } from "@/lib";
import { FooterSidebarApp } from "./Footer";

export const AppSidebar: React.FC = () => {
  const pathName = usePathname();

  const menuItems = [
    {
      title: "Procesos",
      list: [
        {
          title: "Panel general",
          path: "/dashboard",
          icon: MdOutlinePersonalVideo,
        },
        {
          title: "Ordenes de Trabajo",
          path: "/dashboard/work-orders",
          icon: MdBrightness5,
        },
        {
          title: "Empresas",
          path: "/dashboard/customers",
          icon: MdAccountBalance,
        },
        {
          title: "Usuarios",
          path: "/dashboard/operators",
          icon: MdOutlineDirectionsWalk,
        },
      ],
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="bg-gradient-to-r from-emerald-400 to-emerald-200 dark:from-teal-900 dark:to-emerald-600">
        <div className="flex items-center mx-3 mb-[0.55rem]">
          <Image src="/images/logo.png" alt="Logotipo" width={50} height={50} />
          <span className="text-xl font-extrabold bg-gradient-to-r from-teal-950  to-emerald-600  dark:from-teal-700 dark:to-emerald-200 bg-clip-text text-transparent">
            GM E.N.D. SRL.
          </span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="bg-gradient-to-r from-emerald-400 to-emerald-300 dark:from-emerald-950 dark:to-emerald-900">
        {menuItems.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.list.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn([
                        "bg-gradient-to-r hover:from-emerald-900 hover:to-emerald-800",
                        pathName === item.path &&
                          "from-emerald-800 to-emerald-600",
                      ])}
                      isActive={pathName === item.path}
                    >
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <FooterSidebarApp />
    </Sidebar>
  );
};
