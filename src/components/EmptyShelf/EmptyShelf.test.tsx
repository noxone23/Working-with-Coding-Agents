import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyShelf from ".";

describe("EmptyShelf", () => {
  test("shows a message that no book matches", () => {
    render(<EmptyShelf />);
    expect(screen.getByText("No books found.")).toBeInTheDocument();
  });
});
