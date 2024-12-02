import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

interface Params {
  subject: string;
  to: { email: string; name: string }[];
  htmlContent: string,
  code?: string;
  file?: any
}

export async function sendMail({ subject, to, htmlContent, code, file }: Params) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = to;
    sendSmtpEmail.htmlContent = `<html><body><h1>${htmlContent}</h1>`;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME as string,
      email: process.env.EMAIL_FROM_EMAIL as string,
    };
    sendSmtpEmail.attachment = [{
      name: code + '.pdf',
      content: file
    }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function sendMailForgot({ subject, to, htmlContent }: Params) {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.to = to;
    sendSmtpEmail.htmlContent = `<html><body><h1>${htmlContent}</h1>`;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME as string,
      email: process.env.EMAIL_FROM_EMAIL as string,
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      message: 'Error al enviar el correo.',
      response: null
    }
  }
}
