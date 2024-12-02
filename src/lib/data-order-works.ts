import { WorkOrderList } from "./definitions";

export async function getSelectActives(
  token: string,
  filter: string,
  params: any
) {
  const strParams = new URLSearchParams(params);
  let newFilter = "";
  if (filter.length > 0) {
    newFilter = newFilter + `&filter=code:like:${filter}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/select/all/actives?${strParams}${newFilter}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      return {
        statusCode: data.status,
        message: data.error,
        response: data.error,
      };
    }

    const workOrderList: WorkOrderList = data.response.items;
    delete data.response.items;

    return { data, workOrderList };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error,
      response: error,
    };
  }
}

export async function getSelectClosed(
  token: string,
  filter: string,
  params: any
) {
  const strParams = new URLSearchParams(params);
  let newFilter = "";
  if (filter.length > 0) {
    newFilter = newFilter + `&filter=code:like:${filter}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/select/all/closed?${strParams}${newFilter}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      return {
        statusCode: data.status,
        message: data.error,
        response: data.error,
      };
    }

    const workOrderList: WorkOrderList = data.response.items;
    delete data.response.items;

    return { data, workOrderList };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error,
      response: error,
    };
  }
}

export async function getSelectAll({
  filter,
  params,
  token,
}: {
  filter?: string;
  params?: any;
  token: string;
}) {
  const strParams = new URLSearchParams(params);
  let newFilter = "";
  if (filter && filter?.length > 0) {
    newFilter = newFilter + `&filter=code:like:${filter}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/select/all?${strParams}${newFilter}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.error) {
      return {
        statusCode: data.status,
        message: data.error,
        response: data.error,
      };
    }
    type Item = {
      id: number;
      creationTime: string; // ISO 8601 date format
    };
    const ddd: Item[] = data.response.items;
    const sortedArray: Item[] = ddd.sort((a, b) => {
      return (
        new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
      );
    });
    return { data: data.response, workOrderList: sortedArray };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error,
      response: error,
    };
  }
}
