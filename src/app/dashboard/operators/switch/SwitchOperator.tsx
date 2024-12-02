"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Switch } from "@/components";
import { switchWorker } from "@/lib";
import { toast } from "sonner";
import { MdUpdate } from "react-icons/md";
import { redirect } from "next/navigation";

function SwitchOperator({ workerId, status }: any) {
  const [token, setToken] = useState("");
  const [newStatus, setStatus] = useState(status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        redirect("/auth/login");
      } else {
        setLoading(false);
      }

      const token = session?.user?.token;
      setToken(token);
    })();
  }, []);

  if (loading) {
    return (
      <div>
        <Button className="w-full flex justify-center items-center" disabled>
          <MdUpdate className="mr-2 text-accent h-4 w-4 animate-spin" />
          Cargando...
        </Button>
      </div>
    );
  }

  async function onChangeStatus() {
    const newSt = 1 - newStatus;
    setStatus(newSt);
    const result = await switchWorker(token, workerId, newSt);
    if (result.statusCode === 200) {
      toast.success("Exito: ", {
        description: result.message,
        className: "group border-green bg-green-600 text-white",
        position: "top-right",
      });
    } else {
      toast.error("Error: ", {
        description: result.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      setStatus(1 - newSt);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Switch
          id={workerId}
          checked={newStatus == 0 ? true : false}
          onCheckedChange={onChangeStatus}
        />
      </div>
    </>
  );
}

export default SwitchOperator;
