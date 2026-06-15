import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IdentityShell } from "./identity-shell";

describe("IdentityShell", () => {
  it("provides a labelled identity content region and readable mixed-direction content", () => {
    render(
      <IdentityShell
        title="تسجيل الدخول"
        description="أدخل بيانات الحساب للمتابعة."
      >
        <p>
          البريد: <bdi dir="ltr">learner@example.com</bdi>
        </p>
      </IdentityShell>,
    );

    expect(
      screen.getByRole("region", { name: "تسجيل الدخول" }),
    ).toBeInTheDocument();
    expect(screen.getByText("learner@example.com")).toHaveAttribute(
      "dir",
      "ltr",
    );
  });
});
