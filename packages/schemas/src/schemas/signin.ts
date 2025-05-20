import { z } from "zod";

export const SigninDTOSchema  = z.object({
  email: z.string().min(1, { message: "Email é obrigatório" }).nonempty(),
  password: z.string().min(1, { message: "Senha é obrigatória" }).nonempty(),
}).strict();

export type SigninDTO = z.infer<typeof SigninDTOSchema>;