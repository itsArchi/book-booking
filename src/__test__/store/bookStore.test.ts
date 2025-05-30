import { useBookStore } from "../../store/bookStore";

describe("bookStore", () => {
  it("should update the book state when borrowing a book", () => {
    const set = jest.fn();

    const store = useBookStore(() => ({
      books: [
        { code: "book123", title: "Book 1", isBorrowed: false },
        { code: "book456", title: "Book 2", isBorrowed: false },
      ],
      borrowBook: (bookCode: string) => {
        const updatedBooks = store.books.map((book) =>
          book.code === bookCode ? { ...book, isBorrowed: true } : book
        );
        set({ books: updatedBooks });
      },
    }));

    store.borrowBook("book123");

    expect(set).toHaveBeenCalledWith({
      books: [
        { code: "book123", title: "Book 1", isBorrowed: true },
        { code: "book456", title: "Book 2", isBorrowed: false },
      ],
    });
  });
});
