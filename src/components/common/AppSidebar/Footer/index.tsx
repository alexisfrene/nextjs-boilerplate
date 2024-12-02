import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
} from "@/components";
import { getUserById } from "@/src/services";

export const FooterSidebarApp: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userProfile = useQuery({
    queryKey: ["user-profile", session?.user.token],
    queryFn: () => getUserById(session?.user.token || ""),
    enabled: !!session?.user.token,
  });

  if (userProfile.isPending) return <Skeleton className="h-10" />;

  if (userProfile.error)
    return "An error has occurred: " + userProfile.error.message;

  return (
    <SidebarFooter className="bg-gradient-to-r from-emerald-400 to-emerald-200 dark:from-emerald-700 dark:to-emerald-400">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="dark:hover:bg-emerald-700">
                {userProfile?.data?.response.avatar ? (
                  <Avatar className="h-9">
                    <AvatarImage src={userProfile?.data?.response.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                ) : (
                  <User2 />
                )}
                <h1 className="font-light">
                  {userProfile.data.response.firstName}{" "}
                  {userProfile.data.response.lastName}
                </h1>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem
                onClick={() => {
                  router.push("/dashboard/profile");
                }}
              >
                <span>Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className=" w-52 text-left">Cerrar session</div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Estas seguro de que quieres cerrar sesión ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Perderás el acceso hasta que inicies sesión nuevamente.
                        ¿Estás seguro?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        onClick={() => {
                          signOut({ redirect: false });
                          router.push("/auth/login");
                        }}
                        className="bg-red-800 text-white hover:bg-red-700"
                      >
                        Cerrar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
