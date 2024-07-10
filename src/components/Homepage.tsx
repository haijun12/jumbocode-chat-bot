import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [searchMessage, setSearchMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSend = async () => {
    if (searchMessage.trim() === "") return;
    setChatHistory((prevHistory) => [...prevHistory, searchMessage]);
    setSearchMessage("");
    const tempMessage = searchMessage;
    let response = await fetch("/api/getResponse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: tempMessage,
      }),
    });
    let data = await response.json();
    setChatHistory((prevHistory) => [...prevHistory, data]);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-gray-100 h-screen">
        <h1 className="text-2xl">Entertainment Finder</h1>
        <div style={chatWrapper}>
          <div style={chatHistoryContainer}>
            {chatHistory.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
          <div style={chatMessage}>
            <input 
              style ={chatInput}
              type="text" 
              placeholder="Find Entertainment!" 
              value = {searchMessage} 
              onChange={(e) => setSearchMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              />
            <button style= {chatSendButton} onClick = {handleSend}>Send</button>
          </div>
        </div>

        {/* <p>Pages: </p> */}
        {/* <ul className="list-disc ml-8 mb-4">
          <Link href="/" className="list-item text-blue-500">
            Homepage
          </Link>
          <Link href="/users/Gabe" className="list-item text-blue-500">
            Gabe's User Page
          </Link>
          <Link href="/users/Ben" className="list-item text-blue-500">
            Ben's User Page
          </Link>
        </ul>

        <p>API Routes: </p>
        <ul className="list-disc ml-8 mb-4">
          <a href="/api/hello" className="list-item text-blue-500">
            /api/hello
          </a>
          <a href="/api/users?name=Gabe" className="list-item text-blue-500">
            /api/users?name=Gabe
          </a>
          <a href="/api/users?name=Ben" className="list-item text-blue-500">
            /api/users?name=Ben
          </a>
        </ul> */}
      </div>
    </>
  );
}

const chatWrapper = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  border: '1px solid #ccc',
  backgroundColor: '#ffffff',
  borderRadius: '.5rem',
  margin: '10px',
  width: '375px',
  height: '36rem',
};

const chatHistoryContainer = {
  flexGrow: '1',
  overflow: 'scroll',
  padding: '1rem',
};

const chatMessage = {  
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#f8f8f8',
  alignItems: 'center',
  borderRadius: '.5rem',
}

const chatInput = {
  marginLeft: '1rem',
  padding: '.5rem',
  borderRadius: '.5rem',
  border: '1px solid #ccc',
  height: '85%',
  width: '100%',
}

const chatSendButton = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '.5rem',
  borderRadius: '.5rem',
  margin: '.5rem',
}