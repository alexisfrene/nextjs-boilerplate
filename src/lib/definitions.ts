export type WorkerRole = {
  userId: String,
  roleId: String,
}

export type WorkerCustomer = {
  userId: String,
  customerId: String,
}

export type Role = {
  id: String,
  description: String
}

export type Worker = {
  id: string,
  userFile: string,
  userName: string,
  firstName: string,
  lastName: string,
  address: string,
  email: string,
  phone: string,
  avatar: Buffer,
  status: number,
  roles?: WorkerRole[],
  customers?: WorkerCustomer[]
  workOrders?: WorkOrder[]
}

export type Customer = {
  id: string,
  name: string,
  cuit: string,
  fiscalAddress: string,
  baseAddress: string,
  phone: string,
  email: string,
  status: number,
  logo: string
}

export type Balance = {
  workOrderId: string,
  workOrderDetail: string,
  workOrderSerialNumber: string,
  workOrderCode: string,
  workOrderDescription: string,
  toolOutputId: string,
  toolOutputfullName: string,
  toolOutputContact: string,
  toolOutputsignatureHash: string,
  amountWorkOrder: string,
  amountToolOutput: string,
  balance: string,
  toolOutputOperator: string,
  status: string
}

export type TypesEssay = {
  id: string,
  typesEssayId: string,
  code: string,
  description: string,
  status: string
}

export type OperationPart = {
  id: string,
  creationTime: string,
  partNumber: string,
  code: string,
  place: string,
  dateOperation: string,
  amount: number,
  detail: string,
  balance: number,
  fullName: string,
  contact: string,
  operatorId: string,
  signatureHash: string,
  status: string
  typesEssay: TypesEssay[]
}

export type ToolOutput = {
  id: string,
  creationTime: string,
  outputNumber: string,
  code: string,
  place: string,
  amount: number,
  detail: string,
  serialNumber: string,
  outputToolDate: string,
  operatorId: string,
  status: string,
  typesEssay: TypesEssay[]
}

export type Preticket = {
  id: string,
  creationTime: string,
  preticketNumber: string,
  code: true,  
  preticketDate: true,
  recipient: true,
  recipientAddress: true,
  recipientCuit: true,
  transporter: true,
  transporterAddress: true,
  transporterCuit: true,
  saleCash: true,
  saleAccount: true,
  saleOc: true,
  grandTotal: true,
  status: true
}

export type WorkOrder = {
  id: string,
  orderNumber: number,
  code: string,
  place: string,
  workOrderDate: string,
  customerId: string,
  deliveryTerm: string,
  amount: number,
  balance: number,
  detail: string,
  serialNumber: string,
  fullName: string,
  contact: string,
  signatureHash: string,
  creationTime: string,
  status: number,
  user: Worker,
  customer: Customer,
  toolOutput: ToolOutput[],
  operationPart: OperationPart[],
  finalBalance: Balance[],
  typesEssay: TypesEssay[],
  preticket: Preticket[]
}

export type WorkOrderList = {
  workOrder: WorkOrder[];
}

export type userDashboard = {
  id: string,
  name: string,
  activity: any[]
}