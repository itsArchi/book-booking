import request from 'supertest';
import app from '../../../app';

describe('POST /api/member/borrow', () => {
  it('should successfully borrow a book', async () => {
    const response = await request(app)
      .put('/api/member/borrow')
      .send({ memberCode: 'M001', bookCode: 'JK-45' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book borrowed successfully');
  });

  it('should return an error if book is already borrowed', async () => {
    const response = await request(app)
      .put('/api/member/borrow')
      .send({ memberCode: 'M002', bookCode: 'HOB-83' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Book is already borrowed');
  });

  it('should return an error if member has already borrowed 2 books', async () => {
    const response = await request(app)
      .put('/api/member/borrow')
      .send({ memberCode: 'M003', bookCode: 'SHR1' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Member has already borrowed 2 books');
  });
});
