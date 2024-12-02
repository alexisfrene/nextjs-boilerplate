"use client";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CardInfo,
  LineChartComponent,
} from "@/components";
import { getDataDashboard, getUserDataDashboard } from "@/lib";
import { userDashboard } from "@/lib";

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [value, setValue] = useState("");
  const [selectOperator, setSelectOperator] = useState<userDashboard[]>([]);
  const [operatorData, setOperatorData] = useState({} as userDashboard);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      } else {
        await fetchDataDashboard(session?.user?.token);
        await fetchUserDataDashboard(session?.user?.token);
      }
    })();
  }, []);

  const fetchDataDashboard = async (token: string = "") => {
    setLoading(true);
    const { data, cards } = await getDataDashboard(token);
    if (data.statusCode === 401) {
      toast.error("Error: ", {
        description: data.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      setLoading(false);
      router.push("/auth/login");
      return;
    }
    if (data.statusCode === 200) {
      setData(data.response);
      setCards(cards as any);
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

  const fetchUserDataDashboard = async (token: string = "") => {
    setLoading(true);
    const data = await getUserDataDashboard(token);
    if (data.statusCode === 401) {
      toast.error("Error: ", {
        description: data.message,
        className:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        position: "top-right",
      });
      setLoading(false);
      router.push("/auth/login");
      return;
    }
    if (data.statusCode === 200) {
      setSelectOperator(data.response);
      setValue(data.response[0].id);
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

  useEffect(() => {
    const newItems = selectOperator.filter((item: any) => item.id === value);
    if (newItems[0]?.activity) {
      setOperatorData(newItems[0].activity as any);
    }
  }, [value]);

  const onChangeSelect = (value: string) => {
    setValue(value);
  };

  return (
    <div>
      <div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 w-full gap-3 max-w-full p-3">
          {cards.map((item) => (
            <CardInfo item={item} key={item["id"]} />
          ))}
        </div>
        <div className="grid xl:grid-cols-2 lg:grid-cols-1 w-full gap-10 px-2">
          <GridItem title="Relación por Gestión">
            <LineChartComponent data={data} />
          </GridItem>

          <GridItem title="Relación por Operador/Gestión">
            <div>
              <Select
                onValueChange={onChangeSelect}
                defaultValue={value}
                value={value}
              >
                <SelectTrigger className="w-[250px] justify-between">
                  <SelectValue placeholder="Seleccionar un Operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectOperator.map((operator) => (
                      <SelectItem
                        key={operator.id}
                        value={operator.id.toString()}
                      >
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <LineChartComponent data={operatorData} />
          </GridItem>
        </div>
      </div>
    </div>
  );
};

function GridItem({ title, children }: any) {
  return (
    <div className="flex flex-col bg-accent border border-accent items-center justify-center p-4 rounded-md h-[400px] hover:bg-select-title">
      <h3 className="text-2xl font-semibold text-accent mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default Dashboard;
