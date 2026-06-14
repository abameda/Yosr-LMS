import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("shows that the application is ready for development", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Ready for development." }),
    ).toBeInTheDocument();
  });
});
