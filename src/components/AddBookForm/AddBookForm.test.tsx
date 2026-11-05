import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBookForm from ".";

describe("AddBookForm", () => {
  test("has fields for title, author, genre and rating", () => {
    render(<AddBookForm onAdd={() => null} />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Author")).toBeInTheDocument();
    expect(screen.getByLabelText("Book genre")).toBeInTheDocument();
    expect(screen.getByLabelText("Rating")).toBeInTheDocument();
  });

  test("passes the entered book to onAdd and clears the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(() => null);
    render(<AddBookForm onAdd={onAdd} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.selectOptions(screen.getByLabelText("Book genre"), "mystery");
    await user.selectOptions(screen.getByLabelText("Rating"), "4");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(onAdd).toHaveBeenCalledWith({
      title: "Emma",
      author: "Jane Austen",
      genre: "mystery",
      rating: 4,
    });
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Author")).toHaveValue("");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("shows the error and keeps the entered text", async () => {
    const user = userEvent.setup();
    render(<AddBookForm onAdd={() => "Title and author are required."} />);
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Title and author are required."
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Emma");
  });
});
