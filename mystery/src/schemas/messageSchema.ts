import {z} from "zod";

export const messageSchema = z.object({
    content: z
                .string()
                .min(10, {
                    message: "Context must be of 10 characters long."
                })
                .max(300, {
                    message: "Context must be no longer than 300 characters."
                }),
    password: z.string()
});