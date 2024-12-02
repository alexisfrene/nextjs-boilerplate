import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui";

interface Props {
  item: {
    title: string;
    total: number;
  };
}

export const CardInfo: React.FC<Props> = ({ item }) => {
  return (
    <Card className="rounded-2xl shadow-xl">
      <CardHeader className="h-20 mb-3">
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-4xl text-center">{item.total}</p>
      </CardContent>
      <CardFooter>Para el presente MES</CardFooter>
    </Card>
  );
};
