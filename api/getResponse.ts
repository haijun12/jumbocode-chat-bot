import { VercelRequest, VercelResponse } from '@vercel/node';

let token: string;

export default function GET(req: VercelRequest, res: VercelResponse) {
  const message = req.body.message;

  // First fetch request to login and obtain token
  fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: process.env.MY_USERNAME,
      password: process.env.MY_PASSWORD,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.token) {
      token = data.token;

      // Second fetch request to prompt using the obtained token
      return fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/prompt", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ 
                      role: "user", 
                      content: "Your main job is to find entertainment. \
                      Find out what the user is looking for, and then \
                      provide the appropriate entertainment. \
                      Keep the responses short." + message 
                    }]
        })
      });
    } else {
      throw new Error('No token found!');
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Process data from the second fetch request
    if (data) {
      res.status(200).json(data.message.content); // Respond with data from the prompt endpoint
    } else {
      throw new Error('No data received from prompt endpoint!');
    }
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
}
