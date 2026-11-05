import { describe, expect, test } from "vitest";
import { initialBooks } from "./data";
import { loadBooks, saveBooks, STORAGE_KEY } from "./storage";

describe("loadBooks", () => {
  test("returns the fallback when nothing is saved", () => {
    expect(loadBooks(initialBooks)).toBe(initialBooks);
  });

  test("returns the fallback for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadBooks(initialBooks)).toBe(initialBooks);
  });

  test("returns the fallback if the data is not a list of books", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: "Dune" }));
    expect(loadBooks(initialBooks)).toBe(initialBooks);
  });

  test("returns the fallback for an unknown genre", () => {
    const broken = [{ ...initialBooks[0], genre: "poetry" }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(broken));
    expect(loadBooks(initialBooks)).toBe(initialBooks);
  });

  test("returns the fallback for a rating outside 0 to 5", () => {
    const broken = [{ ...initialBooks[0], rating: 6 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(broken));
    expect(loadBooks(initialBooks)).toBe(initialBooks);
  });

  test("loads valid saved books", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([initialBooks[0]]));
    expect(loadBooks(initialBooks)).toEqual([initialBooks[0]]);
  });

  test("loads an empty saved list as an empty shelf", () => {
    localStorage.setItem(STORAGE_KEY, "[]");
    expect(loadBooks(initialBooks)).toEqual([]);
  });
});

describe("saveBooks", () => {
  test("saves the books so that loadBooks finds them", () => {
    saveBooks([initialBooks[1]]);
    expect(loadBooks(initialBooks)).toEqual([initialBooks[1]]);
  });
});
