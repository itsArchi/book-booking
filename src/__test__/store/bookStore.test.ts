import { useBookStore } from '../../store/bookStore';

describe('bookStore', () => {
  it('should update the book state when borrowing a book', () => {
    const set = jest.fn();
    const store = useBookStore(() => ({
      books: [{ code: 'book123', isBorrowed: false }],
      borrowBook: (bookCode: string) => {
        set({ books: [{ code: bookCode, isBorrowed: true }] });
      },
    }));

    store.borrowBook('book123');
    expect(set).toHaveBeenCalledWith({
      books: [{ code: 'book123', isBorrowed: true }],
    });
  });
});
