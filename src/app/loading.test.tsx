import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loading from "./loading";

describe("Loading", () => {
  it("announces an Arabic loading state without stealing focus", () => {
    render(<Loading />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("جارٍ تحميل الصفحة…")).toBeInTheDocument();
  });
});
