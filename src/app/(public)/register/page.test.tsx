import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RegistrationPage from "./page";

describe("registration page", () => {
  it("renders an Arabic email and password form without authority fields", () => {
    render(<RegistrationPage />);

    expect(
      screen.getByRole("heading", { name: "إنشاء حساب جديد" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "البريد الإلكتروني" }),
    ).toHaveAttribute("dir", "ltr");
    expect(screen.getByLabelText("كلمة المرور")).toHaveAttribute(
      "type",
      "password",
    );
    expect(
      screen.queryByLabelText(/الدور|الحالة|المالك/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "إنشاء الحساب" }),
    ).toHaveAttribute("type", "submit");
  });
});
