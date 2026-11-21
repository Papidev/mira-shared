import { z } from "zod";

const sourcedText = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string().min(1)).min(1),
}).strict();
const historicalDate = z.object({
  year: z.number().int().refine((year) => year !== 0, { message: "Year zero is not valid. Use a source-supported negative year for BCE or positive year for CE, or omit an unsupported optional date." }),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  precision: z.enum(["exact", "approximate"]),
}).strict();

export const personContentSchema = z.object({
  description: z.tuple([sourcedText, sourcedText]),
  curiosities: z.array(sourcedText),
  birthDate: historicalDate.optional(),
  deathDate: historicalDate.optional(),
}).strict();

export type PersonContent = z.infer<typeof personContentSchema>;
export const personContentJsonSchema = z.toJSONSchema(personContentSchema);
