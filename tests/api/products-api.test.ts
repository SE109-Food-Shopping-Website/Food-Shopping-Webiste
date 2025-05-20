import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';

describe('API /api/products', () => {
  it('should return list of products', async () => {
    const url = new URL('http://localhost/api/products');
    const req = {
      url: url.toString(),
      method: 'GET',
    } as unknown as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
  });
});