"use server";

// export interface Filtering {
//   property: string;
//   rule: string;
//   value: string;
// }

export async function getWorkers(token: string, filter: string, params: any): Promise<any> {
  const strParams = new URLSearchParams(params)
  let newFilter = '';
  if (filter.length > 0) {
    newFilter = `&filter=firstName:like:${filter}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?${strParams}${newFilter}`
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
      return ({
        statusCode: data.status,
        message: data.error,
        response: data.error
      })
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function getWorker(token: string, workerId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${workerId}`

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getRoles(token: string, params: any) {
  const newParams = 'page=0&size=20'
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/roles?${newParams}`

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.statusCode === 429) {
      return (
        {
          statusCode: data.statusCode,
          message: data.message,
          response: data.message
        }
      )
    }

    if (data.error) {
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data.response.items;
  } catch (error) {
    console.error("Error0:", error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function isCustomer(token: string, workerId: string) {
  const worker = await getWorker(token, workerId)
  if (worker.statusCode === 200) {
    const isObjectPresent = worker.response.roles.find((o: any) => o.id === process.env.CUSTOMER_ROLE);
    if (!isObjectPresent) {
      return false;
    }
    return true;
  }
};

export async function getCustomers(token: string, filter: string, params: any): Promise<any> {
  const strParams = new URLSearchParams(params)
  let newFilter = '';
  if (filter.length > 0) {
    newFilter = `&filter=name:like:${filter}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers?${strParams}${newFilter}`
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
      return ({
        statusCode: data.status,
        message: data.error,
        response: data.error
      })
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function getCustomer(token: string, customerId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers/${customerId}`

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getWorkOrder(token: string, workOrderId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/complete/${workOrderId}`;

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getWorkOrderPdf(token: string, workOrderId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/pdf/${workOrderId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.blob();
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = {
      statusCode: 200,
      message: 'correct',
      response: buffer.toString('base64')
    }

    return result;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getCustomerFromWorkOrdeId(token: string, workOrderId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/customer/${workOrderId}`;

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function getDataDashboard(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/select/dashboard`;

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    const items = data.response;
    const month = new Date().getMonth();
    const dataMonth = items[month];
    let cards = [
      {
        id: 1,
        title: "Ordenes de trabajo Activos",
        acronym: "OTA",
        total: dataMonth.woa,
        change: dataMonth.woa
      },
      {
        id: 2,
        title: "Ordenes de trabajo Cerrados",
        acronym: "OTC",
        total: dataMonth.woc,
        change: dataMonth.woc
      },
      {
        id: 3,
        title: "Partes de Operacion",
        acronym: "PO",
        total: dataMonth.op,
        change: dataMonth.op
      },
      {
        id: 4,
        title: "Salida de Herramientas",
        acronym: "SH",
        total: dataMonth.ot,
        change: dataMonth.ot
      },
    ];

    return { data, cards };
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function getUserDataDashboard(token: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/work-order/users/select/dashboard`;

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
      return (
        {
          statusCode: data.status,
          message: data.error,
          response: data.error
        }
      )
    }

    return data;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
}

export async function getOperationPartPdf(token: string, operationPartId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/operation-part/pdf/${operationPartId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.blob();
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = {
      statusCode: 200,
      message: 'correct',
      response: buffer.toString('base64')
    }

    return result;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getToolOutputPdf(token: string, toolOutputId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tool-output/pdf/${toolOutputId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.blob();
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = {
      statusCode: 200,
      message: 'correct',
      response: buffer.toString('base64')
    }

    return result;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};

export async function getPreticketdf(token: string, preticketId: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/preticket/pdf/${preticketId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.blob();
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = {
      statusCode: 200,
      message: 'correct',
      response: buffer.toString('base64')
    }

    return result;
  } catch (error) {
    console.error(error);
    return ({
      statusCode: 500,
      message: error,
      response: error
    })
  }
};
