/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookBorrowingPage from "../../components/BookBorrowingPage";
import axios from "axios";
jest.mock("axios");

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
];

const mockMembers = [
  { code: "M001", name: "Angga" },
  { code: "M002", name: "Ferry" },
  { code: "M003", name: "Putri" },
];

describe("BookBorrowingPage", () => {
  it("renders available books", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockBooks,
    });

    render(<BookBorrowingPage />);

    await waitFor(() => {
      expect(screen.getByText("Harry Potter")).toBeInTheDocument();
    });
  });

  it("calls the borrow API when borrowing a book", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockBooks,
    });
    (axios.put as jest.Mock).mockResolvedValue({
      status: 200,
      data: { message: "Book borrowed successfully" },
    });

    render(<BookBorrowingPage />);

    const borrowButton = screen.getByText("Borrow");
    fireEvent.click(borrowButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/member/borrow", {
        memberCode: "M001",
        bookCode: "JK-45",
      });
    });
  });

  it("shows error message if borrowing fails", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockBooks,
    });
    (axios.put as jest.Mock).mockRejectedValue(
      new Error("Error borrowing book")
    );

    render(<BookBorrowingPage />);

    const borrowButton = screen.getByText("Borrow");
    fireEvent.click(borrowButton);

    await waitFor(() => {
      expect(screen.getByText("Error borrowing book")).toBeInTheDocument();
    });
  });
});
