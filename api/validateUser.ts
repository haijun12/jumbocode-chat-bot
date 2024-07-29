import dotenv from 'dotenv'
dotenv.config()

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userPassword = body.password;
    if (userPassword == process.env.MY_PASSWORD) {
      return new Response(JSON.stringify(true), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify(false), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}   

