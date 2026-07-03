import { describe, it, expect } from "vitest";
import { changePasswordSchema } from "./my-account.schema";

describe("changePasswordSchema", () => {
  const base = {
    currentPassword: "CurrentPass1",
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  };

  it("accepts a valid payload", () => {
    const result = changePasswordSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects when newPassword is shorter than 8 characters", () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      newPassword: "Ab1",
      confirmPassword: "Ab1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when newPassword has no uppercase letter", () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      newPassword: "lowercase1",
      confirmPassword: "lowercase1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when newPassword has no number", () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      newPassword: "NoNumberHere",
      confirmPassword: "NoNumberHere",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when confirmPassword does not match newPassword", () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      confirmPassword: "Different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("rejects when currentPassword is empty", () => {
    const result = changePasswordSchema.safeParse({
      ...base,
      currentPassword: "",
    });
    expect(result.success).toBe(false);
  });
});
