

import { SigninDTOSchema } from "../schemas/signin"

describe("SigninDTOSchema", () => {
  it("should validate valid signin data", () => {
    const validData = {
      email: "test@example.com",
      password: "password123"
    }

    const result = SigninDTOSchema    .safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("should reject empty email", () => {
    const invalidData = {
      email: "",
      password: "password123"
    }

    const result = SigninDTOSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Email é obrigatório")
    }
  })

  it("should reject empty password", () => {
    const invalidData = {
      email: "test@example.com",
      password: ""
    }

    const result = SigninDTOSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Senha é obrigatória")
    }
  })

  it("should reject extra properties", () => {
    const invalidData = {
      email: "test@example.com",
      password: "password123",
      extraProp: "extra"
    }

    const result = SigninDTOSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
