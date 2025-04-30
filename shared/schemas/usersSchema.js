const { z } = require("zod");

const usersSchema = z.object({
    username: z
        .string()
        .trim()
        .min(4, "Username must be at least 4 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email"),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    role: z.enum(["USER", "ADMIN", "SHOP_ADMIN", "GAME_ADMIN"]).default("USER"),

    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

const usernameSchema = z.string()
    .trim()
    .min(4, "Username must be at least 4 characters");

const passwordSchema = z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const usersLoginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Username or email must not be empty"),

    password: z
        .string()
        .trim()
        .min(1, "Password must not be empty"),
});

module.exports = {
    usersSchema,
    usernameSchema,
    passwordSchema,
    usersLoginSchema
}