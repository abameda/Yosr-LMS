import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

describe("identity form primitives", () => {
  it("associates a visible label with its input", () => {
    render(
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" dir="ltr" />
      </div>,
    );

    expect(
      screen.getByRole("textbox", { name: "البريد الإلكتروني" }),
    ).toHaveAttribute("dir", "ltr");
  });

  it("keeps button focus styling and native button semantics", () => {
    render(<Button type="button">متابعة</Button>);

    const button = screen.getByRole("button", { name: "متابعة" });

    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("focus-visible:");
  });
});
