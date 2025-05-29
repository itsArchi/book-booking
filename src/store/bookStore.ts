import { create } from 'zustand';
import { Book } from '@prisma/client';

interface BookState {
  books: Book[];
  borrowedBooks: Set<string>;
  setBooks: (books: Book[]) => void;
  borrowBook: (bookCode: string) => void;
  returnBook: (bookCode: string) => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  borrowedBooks: new Set(),
  setBooks: (books: Book[]) => set({ books }),  
  borrowBook: (bookCode: string) => set((state: BookState) => {  
    const newBorrowedBooks = new Set(state.borrowedBooks);
    newBorrowedBooks.add(bookCode);
    return { borrowedBooks: newBorrowedBooks };
  }),
  returnBook: (bookCode: string) => set((state: BookState) => {  
    const newBorrowedBooks = new Set(state.borrowedBooks);
    newBorrowedBooks.delete(bookCode);
    return { borrowedBooks: newBorrowedBooks };
  }),
}));
