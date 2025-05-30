/* eslint-disable @typescript-eslint/no-unused-vars */
import { borrowBook } from "../../services/bookServices";
import axios from "axios";

const mockBooks = [
  {
    code: "JK-45",
    title: "Harry Potter",
    author: "J.K. Rowling",
    isBorrowed: false,
    stock: 1,
  },
  {
    code: "SHR-1",
    title: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    isBorrowed: false,
    stock: 1,
  },
  {
    code: "TW-11",
    title: "Twilight",
    author: "Stephenie Meyer",
    isBorrowed: false,
    stock: 1,
  },
];

const mockMembers = [
  { code: "M001", name: "Angga" },
  { code: "M002", name: "Ferry" },
  { code: "M003", name: "Putri" },
];

describe("bookServices", () => {
  it("should borrow a book successfully", async () => {
    (axios.put as jest.Mock).mockResolvedValue({
      data: { message: "Book borrowed successfully" },
    });

    const memberCode = "M001";
    const bookCode = "JK-45";

    const result = await borrowBook(memberCode, bookCode);

    expect(result).toEqual({
      code: bookCode,
      title: "Harry Potter",
      author: "J.K. Rowling",
      stock: 1,
      isBorrowed: true,
      borrowedAt: expect.any(Date),
      memberId: expect.any(Number),
    });
  });

  it("should handle error if borrowing a book fails", async () => {
    (axios.put as jest.Mock).mockRejectedValue(
      new Error("Error borrowing book")
    );

    try {
      const memberCode = "M001";
      const bookCode = "SHR-1";

      await borrowBook(memberCode, bookCode);
    } catch (error: unknown) {
      const typedError = error as Error;

      expect(typedError.message).toBe("Error borrowing book");
    }
  });
});
