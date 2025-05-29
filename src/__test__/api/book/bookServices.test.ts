import axios from "../../../utils/axios";
import MockAdapter from "axios-mock-adapter";
import { borrowBook, returnBook } from "../../../services/bookServices";

// Set up the mock for axios
const mock = new MockAdapter(axios);

describe("bookServices", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should successfully borrow a book", async () => {
    mock.onPut("/member/borrow").reply(200, { data: { message: "Book borrowed successfully" } });

    const memberCode = "12345";
    const bookCode = "54321";

    const response = await borrowBook(memberCode, bookCode);

    expect(response.data.message).toBe("Book borrowed successfully");
  });

  it("should throw an error if borrowing a book fails", async () => {
    mock.onPut("/member/borrow").reply(500, { data: { message: "Error borrowing book" } });

    const memberCode = "12345";
    const bookCode = "54321";

    await expect(borrowBook(memberCode, bookCode)).rejects.toThrow("Error borrowing book");
  });

  it("should successfully return a book", async () => {
    mock.onPut("/member/return").reply(200, { data: { message: "Book returned successfully" } });

    const bookCode = "54321";

    const response = await returnBook(bookCode);

    expect(response.data.message).toBe("Book returned successfully");
  });

  it("should throw an error if returning a book fails", async () => {
    mock.onPut("/member/return").reply(500, { data: { message: "Error returning the book" } });

    const bookCode = "54321";

    await expect(returnBook(bookCode)).rejects.toThrow("Error returning the book");
  });

  it("should fetch available books", async () => {
    const books = [
      { code: "1", title: "Harry Potter", author: "J.K. Rowling", stock: 5, isBorrowed: false },
      { code: "2", title: "Twilight", author: "Stephenie Meyer", stock: 3, isBorrowed: false },
    ];
    mock.onGet("/book").reply(200, books);

    const response = await getAvailableBooks();

    expect(response).toEqual(books);
  });

  it("should throw an error if fetching books fails", async () => {
    mock.onGet("/book").reply(500, { data: { message: "Error fetching available books" } });

    await expect(getAvailableBooks()).rejects.toThrow("Error fetching available books");
  });
});
