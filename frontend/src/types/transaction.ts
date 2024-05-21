export interface Transaction {
  payerDetails: Array<{ payerId: string; amount: number }>;
  splitDetails: Array<{ sharerId: string; amount: number }>;
  id: string;
  categoryId: string;
  currencyId: string;
  title: string;
  totalAmount: number;
  amount: number;
  consumptionDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  groupId: string;
}
