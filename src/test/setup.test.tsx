import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("unit test setup", () => {
  it("renders a marker for one test", () => {
    render(<div>temporary test marker</div>);

    expect(screen.getByText("temporary test marker")).toBeInTheDocument();
  });

  it("starts the next test with an empty DOM", () => {
    expect(screen.queryByText("temporary test marker")).not.toBeInTheDocument();
  });
});
