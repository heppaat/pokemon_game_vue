import fs from "fs/promises";
import { Schema, unknown, z } from "zod";

export const load = async <Schema extends z.ZodTypeAny>(
  filename: string,
  schema: Schema
): Promise<z.infer<typeof schema> | null> => {
  try {
    const rawData = await fs.readFile(
      `${__dirname}/../../database/${filename}.json`,
      "utf-8"
    );
    const data = JSON.parse(rawData);
    const validatedData = schema.parse(data);
    return validatedData;
  } catch (error) {
    return null;
  }
};

export const save = async <Schema extends z.ZodTypeAny>(
  filename: string,
  data: unknown,
  schema: Schema
): Promise<{ success: boolean }> => {
  try {
    const dataToInsert = schema.parse(data);
    const fileContent = JSON.stringify(dataToInsert, null, 2);
    await fs.writeFile(
      `${__dirname}/../../database/${filename}.json`,
      fileContent
    );
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
