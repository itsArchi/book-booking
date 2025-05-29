import { create } from 'zustand';
import { Book } from '@prisma/client';

// Interface for state management
interface BookState {
  books: Book[];
  borrowedBooks: Set<string>;
  setBooks: (books: Book[]) => void;
  borrowBook: (bookCode: string) => void;
  returnBook: (bookCode: string) => void;
}

// Create Zustand store with explicit typing for `set` and `state`
export const useBookStore = create<BookState>((set) => ({
  books: [],
  borrowedBooks: new Set(),
  setBooks: (books: Book[]) => set({ books }),  // Explicitly typed books
  borrowBook: (bookCode: string) => set((state: BookState) => {  // Explicitly type `state`
    const newBorrowedBooks = new Set(state.borrowedBooks);
    newBorrowedBooks.add(bookCode);
    return { borrowedBooks: newBorrowedBooks };
  }),
  returnBook: (bookCode: string) => set((state: BookState) => {  // Explicitly type `state`
    const newBorrowedBooks = new Set(state.borrowedBooks);
    newBorrowedBooks.delete(bookCode);
    return { borrowedBooks: newBorrowedBooks };
  }),
}));
