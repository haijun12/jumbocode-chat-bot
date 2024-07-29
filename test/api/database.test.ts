import { expect, test, beforeAll } from 'vitest'
import { GET, DELETE, POST } from "../../api/getResponse";
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

beforeAll(() => {
  process.env.POSTGRES_URL = 'postgres://default:6cXaQKVmS5Or@ep-white-paper-a4mo5pdl-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require'
  process.env.MY_PASSWORD="Labor-Dot-Cost0"
  process.env.MY_USERNAME="haijun"
})

test('DELETE Chat History', async () => {
  const response = await DELETE();
  expect(response.status).toBe(200);

  const data = await response.json();
  
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(0);
})

test('GET Empty Chat History', async () => {
  const response = await GET();
  expect(response.status).toBe(200);

  const data = await response.json();
  

  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(0);
})

test('POST Chat History', async () => {
  const requestBody = {
    message: 'Tell me if death note or hunter x hunter is better',
    date: '2023-01-01T00:00:00.000Z'
  };

  const request = new Request('http://localhost/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const response = await POST(request);
  expect(response.status).toBe(200);

  const data = await response.json();
  
  expect(Array.isArray(data)).toBe(true);
  
  // If there's any chat history, check the structure of the first item
  if (data.length > 0) {
    expect(data[0]).toHaveProperty('time');
    expect(data[0]).toHaveProperty('message');
  }
});


test('GET Chat History', async () => {
  const response = await GET();
  expect(response.status).toBe(200);

  const data = await response.json();
  

  expect(Array.isArray(data)).toBe(true);

  if (data.length > 0) {
    expect(data[0]).toHaveProperty('time');
    expect(data[0]).toHaveProperty('message');
  }
  expect(data.length).toBe(2);
})