import type { Book } from "./types";

export const STORAGE_KEY = "bookshelf:books";

const genres = ["fantasy", "sci-fi", "mystery", "non-fiction"];

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.genre === "string" &&
    genres.includes(book.genre) &&
    typeof book.rating === "number" &&
    Number.isInteger(book.rating) &&
    book.rating >= 0 &&
    book.rating <= 5 &&
    typeof book.isRead === "boolean"
  );
}

/** The saved books, or `fallback` if nothing valid is saved. `[]` is valid. */
export function loadBooks(fallback: Book[]): Book[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return fallback;
    }
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every(isBook) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // Storage can be full or blocked; the app keeps working without saving.
  }
}
