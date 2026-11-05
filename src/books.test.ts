import { describe, expect, test } from "vitest";
import {
  addBook,
  averageRating,
  countRead,
  filterBooks,
  removeBook,
  toggleRead,
} from "./books";
import { initialBooks } from "./data";

describe("filterBooks", () => {
  test("filters by genre", () => {
    const result = filterBooks(initialBooks, { genre: "sci-fi", query: "" });
    expect(result.map((book) => book.title)).toEqual(["Dune", "Neuromancer"]);
  });

  test("returns all books for the genre 'all'", () => {
    expect(filterBooks(initialBooks, { genre: "all", query: "" })).toHaveLength(
      5
    );
  });

  test("finds a title regardless of upper and lower case", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: "dune" });
    expect(result.map((book) => book.title)).toEqual(["Dune"]);
  });

  test("ignores spaces around the search text", () => {
    const result = filterBooks(initialBooks, { genre: "all", query: " Dune " });
    expect(result).toHaveLength(1);
  });
});

describe("toggleRead", () => {
  test("toggles the read status of one book", () => {
    const result = toggleRead(structuredClone(initialBooks), "b3");
    expect(result.find((book) => book.id === "b3")?.isRead).toBe(true);
    expect(result.find((book) => book.id === "b1")?.isRead).toBe(true);
  });

  test("does not change the original list", () => {
    const books = structuredClone(initialBooks);
    const result = toggleRead(books, "b3");
    expect(books.find((book) => book.id === "b3")?.isRead).toBe(false);
    expect(result).not.toBe(books);
  });
});

describe("removeBook", () => {
  test("removes the book with the given id", () => {
    const result = removeBook(initialBooks, "b2");
    expect(result.map((book) => book.id)).toEqual(["b1", "b3", "b4", "b5"]);
  });
});

describe("addBook", () => {
  const input = {
    title: "  Emma ",
    author: " Jane Austen  ",
    genre: "mystery" as const,
    rating: 4,
  };

  test("adds an unread book with trimmed title and author", () => {
    const result = addBook(initialBooks, input);
    if ("error" in result) {
      throw new Error(result.error);
    }
    expect(result.books).toHaveLength(6);
    expect(result.books[5]).toMatchObject({
      title: "Emma",
      author: "Jane Austen",
      genre: "mystery",
      rating: 4,
      isRead: false,
    });
  });

  test("does not change the original list", () => {
    const books = structuredClone(initialBooks);
    addBook(books, input);
    expect(books).toEqual(initialBooks);
  });

  test("rejects an empty title or author", () => {
    expect(addBook(initialBooks, { ...input, title: "   " })).toHaveProperty(
      "error"
    );
    expect(addBook(initialBooks, { ...input, author: "" })).toHaveProperty(
      "error"
    );
  });

  test("rejects the same title and author ignoring upper and lower case", () => {
    const result = addBook(initialBooks, {
      ...input,
      title: " dune ",
      author: "FRANK HERBERT",
    });
    expect(result).toEqual({ error: "This book is already on your shelf." });
  });

  test("accepts the same title by another author", () => {
    const result = addBook(initialBooks, {
      ...input,
      title: "Dune",
      author: "Someone Else",
    });
    expect(result).toHaveProperty("books");
  });
});

describe("countRead", () => {
  test("counts the read books", () => {
    expect(countRead(initialBooks)).toBe(2);
  });
});

describe("averageRating", () => {
  test("averages only the rated books", () => {
    expect(averageRating(initialBooks)).toBe(4);
  });

  test("returns null when no book is rated", () => {
    expect(averageRating([initialBooks[2], initialBooks[4]])).toBeNull();
  });

  test("returns null for an empty list", () => {
    expect(averageRating([])).toBeNull();
  });
});
