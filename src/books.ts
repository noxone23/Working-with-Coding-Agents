import type { Book, Genre, GenreFilter } from "./types";

export type NewBook = {
  title: string;
  author: string;
  genre: Genre;
  rating: number;
};

type Filter = {
  genre: GenreFilter;
  query: string;
};

export function filterBooks(books: Book[], { genre, query }: Filter): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  return books.filter(
    (book) =>
      (genre === "all" || book.genre === genre) &&
      book.title.toLowerCase().includes(normalizedQuery)
  );
}

export function toggleRead(books: Book[], id: string): Book[] {
  return books.map((book) =>
    book.id === id ? { ...book, isRead: !book.isRead } : book
  );
}

export function removeBook(books: Book[], id: string): Book[] {
  return books.filter((book) => book.id !== id);
}

/**
 * Adds an unread book. Title and author are trimmed and required; a book with
 * the same title and author (ignoring case) is rejected.
 */
export function addBook(
  books: Book[],
  input: NewBook
): { books: Book[] } | { error: string } {
  const title = input.title.trim();
  const author = input.author.trim();
  if (title === "" || author === "") {
    return { error: "Title and author are required." };
  }
  const isDuplicate = books.some(
    (book) =>
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
  );
  if (isDuplicate) {
    return { error: "This book is already on your shelf." };
  }
  const book: Book = {
    id: crypto.randomUUID(),
    title,
    author,
    genre: input.genre,
    rating: input.rating,
    isRead: false,
  };
  return { books: [...books, book] };
}

export function countRead(books: Book[]): number {
  return books.filter((book) => book.isRead).length;
}

/** Average of all rated books, rounded to one decimal. `null` if no book is rated. */
export function averageRating(books: Book[]): number | null {
  const rated = books.filter((book) => book.rating > 0);
  if (rated.length === 0) {
    return null;
  }
  const sum = rated.reduce((total, book) => total + book.rating, 0);
  return Math.round((sum / rated.length) * 10) / 10;
}
