import { expect, test, beforeAll } from 'vitest'
import { POST } from "../../api/validateUser";
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

beforeAll(() => {
    process.env.MY_PASSWORD="Labor-Dot-Cost0"
})

test('POST Valid Password', async () => {
    const requestBody = {
        password: 'Labor-Dot-Cost0'
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
    
    expect(typeof data).toBe('boolean');
    expect(data).toBe(true);
});

test('POST Empty Password', async () => {
    const requestBody = {
        password: ''
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

    expect(typeof data).toBe('boolean');
    expect(data).toBe(false);
});

test('POST Invalid Password', async () => {
    const requestBody = {
        password: 'InvalidPassword'
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
    
    expect(typeof data).toBe('boolean');
    expect(data).toBe(false);
});
