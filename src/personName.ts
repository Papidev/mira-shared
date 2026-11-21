import { z } from "zod";

export const personNameSchema = z.string()
  .overwrite((name) => name.replace(/\*\*([^*]+)\*\*/g, "$1").trim())
  .min(1);
