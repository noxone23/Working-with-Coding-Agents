import { describe, expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  test("renders all books", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });

  test("shows only the books of the selected genre", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Genre"), "sci-fi");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  test("marks a book as read", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "Mark Gone Girl as read" })
    );
    expect(
      screen.getByRole("button", { name: "Mark Gone Girl as unread" })
    ).toBeInTheDocument();
    expect(screen.getByText(/3 of 5 read/)).toBeInTheDocument();
  });

  test("removes the right book while a genre filter is active", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Genre"), "sci-fi");
    await user.click(
      screen.getByRole("button", { name: "Remove Neuromancer" })
    );
    await user.selectOptions(screen.getByLabelText("Genre"), "all");
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual(["Dune", "The Hobbit", "Gone Girl", "Sapiens"]);
  });

  async function addEmma(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Title"), "Emma");
    await user.type(screen.getByLabelText("Author"), "Jane Austen");
    await user.click(screen.getByRole("button", { name: "Add book" }));
  }

  test("adds a book to the list and counts it", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addEmma(user);
    expect(screen.getByRole("heading", { name: "Emma" })).toBeInTheDocument();
    expect(screen.getByText(/2 of 6 read/)).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
  });

  test("rejects a duplicate book", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Title"), "dune");
    await user.type(screen.getByLabelText("Author"), "frank herbert");
    await user.click(screen.getByRole("button", { name: "Add book" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This book is already on your shelf."
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });

  test("keeps an added book after the app is started again", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await addEmma(user);
    unmount();
    render(<App />);
    expect(screen.getByRole("heading", { name: "Emma" })).toBeInTheDocument();
  });

  test("shows the sample books if the saved data is not valid", () => {
    localStorage.setItem("bookshelf:books", "garbage");
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
  });

  test("shows 'Average rating: 4' for the sample books", () => {
    render(<App />);
    const stats = screen.getByText(/Average rating/);
    expect(within(stats).queryByText("NaN")).toBeNull();
    expect(stats).toHaveTextContent("Average rating: 4");
  });
});
