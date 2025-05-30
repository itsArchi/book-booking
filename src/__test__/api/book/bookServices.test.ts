/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "../../../utils/axios";
import MockAdapter from "axios-mock-adapter";
import { borrowBook, returnBook } from "../../../services/bookServices";

const mock = new MockAdapter(axios);

const mockBooks = [
  {
    code: "JK-45",
    title: "Harry Potter",
    author: "J.K. Rowling",
    stock: 1,
    isBorrowed: false,
  },
  {
    code: "SHR-1",
    title: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    stock: 1,
    isBorrowed: false,
  },
  {
    code: "TW-11",
    title: "Twilight",
    author: "Stephenie Meyer",
    stock: 1,
    isBorrowed: false,
  },
  {
    code: "HOB-83",
    title: "The Hobbit, or There and Back Again",
    author: "J.R.R. Tolkien",
    stock: 1,
    isBorrowed: false,
  },
  {
    code: "NRN-7",
    title: "The Lion, the Witch and the Wardrobe",
    author: "C.S. Lewis",
    stock: 1,
    isBorrowed: false,
  },
];

const mockMembers = [
  { code: "M001", name: "Angga" },
  { code: "M002", name: "Ferry" },
  { code: "M003", name: "Putri" },
];

describe("bookServices", () => {
  afterEach(() => {
    mock.reset();
  });

  it("should successfully borrow a book", async () => {
    mock
      .onPut("/member/borrow")
      .reply(200, { message: "Book borrowed successfully" });
    const memberCode = "M001";
    const bookCode = "JK-45";

    const response = await borrowBook(memberCode, bookCode);

    expect(response).toEqual({
      code: bookCode,
      title: "Harry Potter",
      author: "J.K. Rowling",
      stock: 1,
      isBorrowed: true,
      borrowedAt: expect.any(Date),
      memberId: expect.any(Number),
    });
  });

  it("should throw an error if borrowing a book fails", async () => {
    mock
      .onPut("/member/borrow")
      .reply(500, { message: "Error borrowing book" });

    const memberCode = "M001";
    const bookCode = "JK-45";

    await expect(borrowBook(memberCode, bookCode)).rejects.toThrow(
      "Error borrowing book"
    );
  });

  it("should successfully return a book", async () => {
    mock
      .onPut("/member/return")
      .reply(200, { message: "Book returned successfully" });

    const bookCode = "JK-45";

    const response = await returnBook(bookCode);

    expect(response).toEqual({
      code: bookCode,
      title: "Harry Potter",
      author: "J.K. Rowling",
      stock: 1,
      isBorrowed: true,
      borrowedAt: expect.any(Date),
      memberId: expect.any(Number),
    });
  });

  it("should throw an error if returning a book fails", async () => {
    mock
      .onPut("/member/return")
      .reply(500, { message: "Error returning the book" });

    const bookCode = "JK-45";

    await expect(returnBook(bookCode)).rejects.toThrow(
      "Error returning the book"
    );
  });

  it("should fetch available books", async () => {
    mock.onGet("/book").reply(200, mockBooks);

    const response = await getAvailableBooks();

    expect(response).toEqual(mockBooks);
  });

  it("should throw an error if fetching books fails", async () => {
    mock
      .onGet("/book")
      .reply(500, { message: "Error fetching available books" });

    await expect(getAvailableBooks()).rejects.toThrow(
      "Error fetching available books"
    );
  });
});
