import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("public home", () => {
  it("renders the Arabic-first identity foundation with explicit bidi boundaries", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "أساس واجهة الحسابات جاهز" }),
    ).toBeInTheDocument();
    expect(screen.getByText("hello@example.com")).toHaveAttribute("dir", "ltr");
    expect(screen.getByText("YSR-1024")).toHaveAttribute("dir", "ltr");
    expect(screen.getByText("2026")).toHaveAttribute("dir", "ltr");
  });
});
