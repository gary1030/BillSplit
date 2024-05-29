"use server";
import fetchGroupTransactions from "./fetchGroupTransactions";

interface Group {
  id: string;
  name: string;
  theme: string;
}

interface UnifiedRecord {
  id: string;
  categoryId?: string;
  groupId?: string;
  title?: string;
  totalAmount?: number;
  amount?: number;
  consumptionDate: string;
  payerDetails?: Array<{ payerId: string; amount: number }>;
  splitDetails?: Array<{ sharerId: string; amount: number }>;
  payerId?: string;
  receiverId?: string;
  createdAt: string;
}

export default async function fetchAllGroupTransactions(
  groups: Group[],
  startTime?: Date,
  endTime?: Date
) {
  try {
    const results = await Promise.all(
      groups.map((group) =>
        fetchGroupTransactions(group.id, startTime, endTime).then(
          (transactions) =>
            transactions.map((transaction: UnifiedRecord) => ({
              ...transaction,
              groupId: group.id,
              groupName: group.name,
            }))
        )
      )
    );
    return results.flat();
  } catch (error) {
    throw new Error("Failed to fetch all group transactions!");
  }
}
