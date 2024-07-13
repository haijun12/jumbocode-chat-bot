import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from "@vercel/postgres";
// import DateFormat from "../src/utils/DateFormat";

let token: string;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(req.method)
  console.log(req.body)
  if (req.method == 'POST') {
    const userMessage = req.body.message;
    const userDate = req.body.date;

    try {
      // First fetch request to login and obtain token
      const loginResponse = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: process.env.MY_USERNAME,
          password: process.env.MY_PASSWORD,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(`HTTP error! status: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      console.log('Login response data:', loginData);

      if (!loginData.token) {
        throw new Error('No token found!');
      }

      token = loginData.token;

      // Second fetch request to prompt using the obtained token
      const promptResponse = await fetch("https://tl-onboarding-project-dxm7krgnwa-uc.a.run.app/prompt", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: "Your main job is to find entertainment. Find out what the user is looking for, and then provide the appropriate entertainment. Keep the responses short." + userMessage
          }]
        })
      });

      if (!promptResponse.ok) {
        throw new Error(`HTTP error! status: ${promptResponse.status}`);
      }

      const promptData = await promptResponse.json();
      console.log('Prompt response data:', promptData);

      if (!promptData) {
        throw new Error('No data received from prompt endpoint!');
      }

      await addToDatabase(userMessage, userDate);
      await addToDatabase(promptData.message.content, DateFormat(new Date()));
      let chatHistory = await getDatebase();

      res.status(200).json(chatHistory.reverse());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method == 'DELETE') {
    console.log("DELETE");
    let chatHistory = await deleteFromDatabase();
    res.status(200).json(chatHistory);
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}



const addToDatabase = async (message: string, date: string) => {
  const result = await sql`
        INSERT INTO jumbocode_chat_history (time, message)
        VALUES (${date}, ${message})
        RETURNING *;
      `;
  return result.rows[0];
}

const getDatebase = async () => {
  const result = await sql`
    SELECT * FROM jumbocode_chat_history
    ORDER BY time DESC
    LIMIT 10;
  `;
  return result.rows;
}

const deleteFromDatabase = async () => {
  const result = await sql`
    DELETE FROM jumbocode_chat_history;
  `;
  console.log("RESULT", result);
  return result.rows;
}

function DateFormat(date: Date | null) {
  if (!date) {
    return 'Loading...';
  }
  let period = "am";
  let hours = date.getHours().toString().padStart(2, '0');
  if (parseInt(hours) > 12) {
    hours = String(parseInt(hours) - 12);
    period = "pm";
  }

  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year} | ${dayOfWeek} ${hours}:${minutes}:${seconds} ${period}`;
}