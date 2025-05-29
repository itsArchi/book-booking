import { borrowBook } from '../../services/bookServices';
import axios from 'axios';

describe('bookServices', () => {
  it('should borrow a book', async () => {
    // Mock the resolved value for axios.put
    (axios.put as jest.Mock).mockResolvedValue({ status: 200, data: { message: 'Book borrowed successfully' } });

    const result = await borrowBook('12345', 'book123');
    expect(result.message).toBe('Book borrowed successfully');
  });

  it('should handle error if borrowing a book fails', async () => {
    // Mock the rejected value for axios.put
    (axios.put as jest.Mock).mockRejectedValue(new Error('Error borrowing book'));

    try {
      await borrowBook('12345', 'book123');
    } catch (error: unknown) {
      const typedError = error as Error; // Type assertion
      expect(typedError.message).toBe('Error borrowing book');
    }
  });
});
