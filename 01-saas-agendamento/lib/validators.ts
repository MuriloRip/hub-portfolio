import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "A senha precisa ter no minimo 6 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "A senha precisa ter no minimo 6 caracteres")
});

export const clientSchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  email: z.string().email("Email invalido").optional().or(z.literal("")),
  phone: z.string().min(8, "Telefone obrigatorio"),
  notes: z.string().optional()
});

export const appointmentSchema = z.object({
  title: z.string().min(2, "Titulo obrigatorio"),
  clientId: z.string().min(1, "Cliente obrigatorio"),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: z.enum(["confirmed", "pending", "canceled"]),
  notes: z.string().optional()
});
