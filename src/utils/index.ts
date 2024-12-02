// import axios from "axios";
// import { getSession } from "next-auth/react";

// // Crear una instancia para el cliente
// const createClientAxiosInstance = async (contentType: string) => {
//   const token = await getSession();

//   return axios.create({
//     baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//     headers: {
//       "Content-Type": contentType,
//       ...(token && { Authorization: `Bearer ${token}` }), // Agrega el token si está disponible
//     },
//   });
// };

// // Crear una instancia básica (sin token, para el servidor)
// const createServerAxiosInstance = (contentType: string) => {
//   return axios.create({
//     baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//     headers: {
//       "Content-Type": contentType,
//     },
//   });
// };

// // Exportar según el entorno
// export const axiosInstance =
//   typeof window !== "undefined"
//     ? await createClientAxiosInstance("application/json")
//     : createServerAxiosInstance("application/json");

// export const axiosInstanceFormData =
//   typeof window !== "undefined"
//     ? await createClientAxiosInstance("multipart/form-data")
//     : createServerAxiosInstance("multipart/form-data");
