import {
  BusinessMetricSnapshotSchema,
  ExpenseRecordSchema,
  RevenueRecordSchema,
  type BusinessMetricSnapshot,
  type ExpenseRecord,
  type RevenueRecord,
} from "@/core/schemas";

export function validateRevenueRecord(record: RevenueRecord): RevenueRecord {
  const parsed = RevenueRecordSchema.parse(record);
  if (parsed.amountOriginal.currency !== "USD" && (!parsed.fxDate || !parsed.fxSource)) {
    throw new Error("Non-USD revenue requires an FX date and source");
  }
  if (parsed.armsLength === parsed.relatedParty) {
    throw new Error("Revenue must be classified as exactly one of arms-length or related-party");
  }
  return parsed;
}

export function validateExpenseRecord(record: ExpenseRecord): ExpenseRecord {
  const parsed = ExpenseRecordSchema.parse(record);
  if (parsed.amount.currency !== "USD" && (!parsed.fxDate || !parsed.fxSource)) {
    throw new Error("Non-USD expense requires an FX date and source");
  }
  return parsed;
}

export function calculateBusinessMetrics(
  revenues: RevenueRecord[],
  expenses: ExpenseRecord[],
  capturedAt = new Date(),
): BusinessMetricSnapshot {
  const validRevenue = revenues.map(validateRevenueRecord);
  const validExpenses = expenses.map(validateExpenseRecord);
  const active = validRevenue.filter((record) => !record.refunded);
  const totalRevenueUsdMinorUnits = active.reduce(
    (total, record) => total + record.amountUsdMinorUnits,
    0,
  );
  const armsLengthRevenueUsdMinorUnits = active
    .filter((record) => record.armsLength)
    .reduce((total, record) => total + record.amountUsdMinorUnits, 0);
  const relatedPartyRevenueUsdMinorUnits = active
    .filter((record) => record.relatedParty)
    .reduce((total, record) => total + record.amountUsdMinorUnits, 0);
  const refundedRevenueUsdMinorUnits = validRevenue
    .filter((record) => record.refunded)
    .reduce((total, record) => total + record.amountUsdMinorUnits, 0);
  const totalExpenseUsdMinorUnits = validExpenses.reduce(
    (total, record) => total + record.amountUsdMinorUnits,
    0,
  );
  const marketingSpendUsdMinorUnits = validExpenses
    .filter((record) => ["MARKETING", "CUSTOMER_ACQUISITION"].includes(record.category))
    .reduce((total, record) => total + record.amountUsdMinorUnits, 0);

  return BusinessMetricSnapshotSchema.parse({
    capturedAt: capturedAt.toISOString(),
    totalRevenueUsdMinorUnits,
    armsLengthRevenueUsdMinorUnits,
    relatedPartyRevenueUsdMinorUnits,
    refundedRevenueUsdMinorUnits,
    totalExpenseUsdMinorUnits,
    marketingSpendUsdMinorUnits,
    netIncomeUsdMinorUnits: totalRevenueUsdMinorUnits - totalExpenseUsdMinorUnits,
  });
}
