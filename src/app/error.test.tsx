import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GlobalError from "./error";

describe("GlobalError", () => {
  it("presents an accessible Arabic error and retries on request", () => {
    const reset = vi.fn();

    render(<GlobalError error={new Error("test")} reset={reset} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "تعذّر تحميل الصفحة" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "إعادة المحاولة" }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
