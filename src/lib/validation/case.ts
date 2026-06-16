import { z } from "zod";

export const createCaseSchema = z.object({
  productName: z.string().min(2, "商品名を入力してください。"),
  modelNumber: z.string().min(1, "型番を入力してください。"),
  destinationCountry: z.string().min(2, "輸出先国を入力してください。"),
  customerCompanyName: z.string().min(2, "顧客企業名を入力してください。"),
  productImageUrl: z.url().optional().or(z.literal("")).transform((value) => value || undefined),
});

export type CreateCaseSchema = z.infer<typeof createCaseSchema>;