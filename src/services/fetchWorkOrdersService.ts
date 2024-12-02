// import { axiosInstanceFormData } from "@/src/utils";

// interface FetchWorkOrdersParams {
//   token: string;
//   filter: any;
//   params: {
//     page: number;
//     size: number;
//   };
// }

// export const fetchWorkOrdersService = async ({
//   filter,
//   params,
// }: FetchWorkOrdersParams) => {
//   try {
//     const response = await axiosInstanceFormData.post("/api/workOrders", {
//       filter,
//       params,
//     });

//     return response.data;
//   } catch (error: any) {
//     throw (
//       error.response?.data || {
//         statusCode: 500,
//         message: "Error desconocido",
//       }
//     );
//   }
// };
