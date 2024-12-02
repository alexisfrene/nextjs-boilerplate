'use server';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuit: z.string(),
  fiscalAddress: z.string(),
  baseAddress: z.string(),
  phone: z.string(),
  email: z.string(),
  logo: z.string(),
});

const AddCustomer = FormSchema.omit({ id: true, logo: true });

export async function addCustomer(
  token: string,
  formData: FormData,
  filesObject: any
) {
  const { name, cuit, fiscalAddress, baseAddress, phone, email } = AddCustomer.parse({
    name: formData.get('name'),
    cuit: formData.get('cuit'),
    fiscalAddress: formData.get('fiscalAddress'),
    baseAddress: formData.get('baseAddress'),
    phone: formData.get('phone'),
    email: formData.get('email')
  });

  const files = formData.getAll('files')

  const objectCustomer = {
    name,
    cuit,
    fiscalAddress,
    baseAddress,
    phone,
    email,
    files: filesObject
  }

  return await addCustomerApi(token, objectCustomer, files);
}

async function addCustomerApi(token: String, object: any, files: any) {
  const formData = new FormData();
  formData.append('object', JSON.stringify(object));
  files.forEach((file: any) => {
    formData.append('files', file);
  })

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        authorization: `Bearer ${token}`
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

export async function deleteCustomers(
  token: string,
  ids: string[]
) {
  const object = {
    ids: ids
  }
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers/multiple-delete`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
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

export async function switchCustomer(
  token: string,
  id: string,
  status: number
) {
  const object = {
    id,
    status: status == 0 ? true : false
  };
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers/switch-status`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
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

export async function editCustomer(
  token: string,
  customerId: string,
  formData: FormData,
  filesObject: any
) {
  const { name, cuit, fiscalAddress, baseAddress, phone, email } = AddCustomer.parse({
    name: formData.get('name'),
    cuit: formData.get('cuit'),
    fiscalAddress: formData.get('fiscalAddress'),
    baseAddress: formData.get('baseAddress'),
    phone: formData.get('phone'),
    email: formData.get('email')
  });

  const files = formData.getAll('files');

  const objectCustomer = {
    name,
    cuit,
    fiscalAddress,
    baseAddress,
    phone,
    email,
    files: filesObject
  }

  return await editCustomerApi(token, customerId, objectCustomer, files);
}

async function editCustomerApi(
  token: string,
  customerId: string,
  object: any,
  files: any
) {
  const formData = new FormData();
  formData.append('object', JSON.stringify(object));
  files.forEach((file: any) => {
    formData.append('files', file);
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customers/${customerId}`
  try {
    const res = await fetch(url, {
      method: "PUT",
      body: formData,
      headers: {
        authorization: `Bearer ${token}`
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
