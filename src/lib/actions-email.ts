'use server';

import { sendMail, sendMailForgot } from "./brevo";
import { getRandomBytes } from "./utils";

export async function handleForm(formData: FormData) {
  const content = formData.get('content');
  const name = formData.get('name');
  const toEmail = formData.get('email');
  const code = formData.get('code');
  const file = formData.get('file');

  if (content?.toString().trim() === '') {
    return {
      statusCode: 400,
      message: 'No existe mensaje a enviar',
      response: null
    }
  }
  if (toEmail?.toString().trim() === '') {
    return {
      statusCode: 400,
      message: 'No existe correo a donde enviar',
      response: null
    }
  }

  if (code?.toString().trim() === '') {
    return {
      statusCode: 400,
      message: 'No existe orden de trabajo',
      response: null
    }
  }

  if (name?.toString().trim() === '') {
    return {
      statusCode: 400,
      message: 'No existe nombre',
      response: null
    }
  }

  if (!content || !name || !toEmail || !code) {
    return {
      statusCode: 400,
      message: 'Todos los campos son obligatorios',
      response: null
    }
  }

  const subject = `Orden de Trabajo ${code}`
  try {
    await sendMail({
      subject,
      to: [{ email: toEmail.toString(), name: name.toString() }],
      htmlContent: content.toString(),
      code: code.toString(),
      file: file
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: 'Error al enviar correo',
      response: null
    }
  }

  return {
    statusCode: 200,
    message: 'Correo electrónico enviado correctamente.',
    response: null
  }
}

async function forgotPasswordApi(email: string, hash: string, expires: any) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/forgotpassword`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        token: hash,
        expires: expires
      }),
      headers: {
        'Content-Type': 'application/json',
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

export async function forgotPassword(toEmail: string) {
  if (toEmail?.toString().trim() === '') {
    return {
      statusCode: 400,
      message: 'No existe correo a donde enviar',
      response: null
    }
  }
  if (!toEmail) {
    return {
      statusCode: 400,
      message: 'No existe correo a donde enviar',
      response: null
    }
  }

  const expires = Date.now() + 900000; // 15 minutes
  const { random, hash } = getRandomBytes(32);

  const result = await forgotPasswordApi(toEmail, hash, expires);
  console.log('result:', result);
  if (result.statusCode !== 200) {
    return result;
  }

  const url = `${process.env.NEXT_RESET_URL}/${random}`;
  const subject = 'Olvido de contraseña';
  let resultSendMail: any;
  try {
    resultSendMail = await sendMailForgot({
      subject,
      to: [{ email: toEmail.toString(), name: toEmail.toString() }],
      htmlContent: `<h3>Hola, ¿Tiene problemas para iniciar sesión?</h3>
                  <p>Si no has realizado esta solicitud, ignora este correo electrónico.<br/>
                  </p>De lo contrario, haz clic en este enlace para cambiar tu contraseña:<a href=${url}>${url}</a><br/><br/>                  
                `
    });
    if (resultSendMail.statusCode && resultSendMail.statusCode !== 200) {
      return resultSendMail;
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: 'Error al enviar correo',
      response: null
    }
  }

  return {
    statusCode: 200,
    message: 'Correo electrónico enviado correctamente.',
    response: null
  }
}

export async function resetPassword(
  token: string,
  password: string
) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/resetpassword`
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        token: token,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await res.json();
    if (data.error) {
      return (
        {
          statusCode: data.status,
          message: data.message,
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
