import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookBorrowingPage from '../../components/BookBorrowingPage';
import axios from 'axios';
jest.mock('axios'); 

describe('BookBorrowingPage', () => {
  it('renders available books', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        { code: 'book123', title: 'Book 1', author: 'Author 1', isBorrowed: false, stock: 5 },
      ],
    });

    render(<BookBorrowingPage />);

    await waitFor(() => {
      expect(screen.getByText('Book 1')).toBeInTheDocument();
    });
  });

  it('calls the borrow API when borrowing a book', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        { code: 'book123', title: 'Book 1', author: 'Author 1', isBorrowed: false, stock: 5 },
      ],
    });
    (axios.put as jest.Mock).mockResolvedValue({ status: 200 });

    render(<BookBorrowingPage />);

    const borrowButton = screen.getByText('Borrow');
    fireEvent.click(borrowButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/member/borrow', { memberCode: '12345', bookCode: 'book123' });
    });
  });

  it('shows error message if borrowing fails', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        { code: 'book123', title: 'Book 1', author: 'Author 1', isBorrowed: false, stock: 5 },
      ],
    });
    (axios.put as jest.Mock).mockRejectedValue(new Error('Error borrowing book'));

    render(<BookBorrowingPage />);

    const borrowButton = screen.getByText('Borrow');
    fireEvent.click(borrowButton);

    await waitFor(() => {
      expect(screen.getByText('Error borrowing book')).toBeInTheDocument();
    });
  });
});
