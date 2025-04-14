import { z } from "zod";

export const usersSchema = z.object({
    username: z
        .string()
        .min(4, "Username must be at least 4 characters"),

    email: z
        .string()
        .email("Invalid email"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    role: z.enum(["USER", "ADMIN", "SHOP_ADMIN", "GAME_ADMIN"]).default("USER"),

    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
