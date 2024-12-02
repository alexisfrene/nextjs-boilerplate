'use server';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  userFile: z.string().optional(),
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  email: z.string(),
  password: z.string().optional(),
  phone: z.string(),
  avatar: z.string(),
  roles: z.string()
});

const FormSchemaPassword = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

const FormSchemaCustomer = z.object({
  id: z.string()
});

const AddWorker = FormSchema.omit({ id: true, avatar: true });

export async function addWorker(
  token: string,
  formData: FormData,
  filesObject: any
) {
  const { userFile, userName, firstName, lastName, address, email, password, phone, roles } = AddWorker.parse({
    userFile: formData.get('userFile'),
    userName: formData.get('userName'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    address: formData.get('address'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    roles: formData.get('roles'),
  });

  const files = formData.getAll('files')

  let selectRoles = JSON.parse(roles);
  selectRoles = selectRoles.map((role: any) => {
    return { id: role.id }
  }
  );
  const objectWorker = {
    userFile,
    userName,
    firstName,
    lastName,
    address,
    email,
    password,
    phone,
    roles: selectRoles,
    files: filesObject
  }

  return await addWorkerApi(token, objectWorker, files);
}

async function addWorkerApi(token: String, object: any, files: any) {
  const formData = new FormData();
  formData.append('object', JSON.stringify(object));
  files.forEach((file: any) => {
    formData.append('files', file);
  })

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
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

export async function deleteWorkers(
  token: string,
  ids: string[]
) {
  const object = {
    ids: ids
  }
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/multiple-delete`
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

export async function switchWorker(
  token: string,
  id: string,
  status: number
) {
  const object = {
    id,
    status: status == 0 ? true : false
  };
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/switch-status`
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

export async function editWorker(
  token: string,
  workerId: string,
  formData: FormData,
  filesObject: any
) {
  const { userName, firstName, lastName, address, email, phone, roles } = AddWorker.parse({
    userName: formData.get('userName'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    address: formData.get('address'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    roles: formData.get('roles')
  });

  const files = formData.getAll('files');

  let selectRoles = JSON.parse(roles);
  selectRoles = selectRoles.map((role: any) => {
    return { id: role.id }
  });
  const objectWorker = {
    userName,
    firstName,
    lastName,
    address,
    email,
    phone,
    roles: selectRoles,
    files: filesObject
  }

  return await editWorkerApi(token, workerId, objectWorker, files);
}

async function editWorkerApi(
  token: string,
  workerId: string,
  object: any,
  files: any
) {
  const formData = new FormData();
  formData.append('object', JSON.stringify(object));
  files.forEach((file: any) => {
    formData.append('files', file);
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${workerId}`
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

export async function changePasswordWorker(
  token: string,
  formData: FormData
) {
  const { password, confirmPassword } = FormSchemaPassword.parse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/changepassword`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ password: password }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
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

export async function editCustomerWorker(
  token: string,
  workerId: string,
  formData: FormData,
) {
  const customers = formData.get('customers');

  let selectCustomers = JSON.parse(customers as string);
  selectCustomers = selectCustomers.map((customer: any) => {
    return { id: customer.id }
  });

  const objectWorkerCustomer = {
    customers: selectCustomers,
  }

  return await editCustomerWorkerApi(token, workerId, objectWorkerCustomer);
}

async function editCustomerWorkerApi(
  token: string,
  workerId: string,
  object: any
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/customers/${workerId}`

  try {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(object),
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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