// import { Link } from "wouter";
import { useEffect, useState } from "react";
import DateFormat from "../utils/DateFormat";

export default function Homepage() {
  const [searchMessage, setSearchMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  var date = new Date();
  var dateString = DateFormat(date);
  const handleSend = async () => {
    if (searchMessage.trim() === "") return;
    setChatHistory([...chatHistory, { message: searchMessage, date: dateString }]);
    setSearchMessage("");
    const tempMessage = searchMessage;
    let response = await fetch("/api/getResponse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: tempMessage,
        date: dateString,
      }),
    });
    let data = await response.json();
    console.log(data);
    setChatHistory(data);
  }

  const handleClearHistory = async() => {
    const response = await fetch('/api/getResponse', {
      method: 'DELETE',
      body: JSON.stringify({ message: "clear history" }),
      headers: {
          'Content-Type': 'application/json'
      }
    });
    let data = await response.json();
    console.log(data);
    setChatHistory(data);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/getResponse', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      setChatHistory(data);
    }
    fetchData();
  },[])

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-gray-100 h-screen">
        <h1 className="text-2xl">Entertainment Finder</h1>
        <div style={chatWrapper}>
          <div style={chatHistoryContainer}>
          {chatHistory.map((chatMessage, index) => (
            <p key={index} style={index % 2 === 0 ? leftText : rightText}>
              {chatMessage.message}
            </p>
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
          <button style= {chatSendButton} onClick = {handleClearHistory}>Clear History</button>
        </div>
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
  overflow: 'auto',
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

const leftText = {
  textAlign: 'left' as 'left',
  padding: '.3rem',
  margin: '.5rem',
  backgroundColor: 'lightgrey',
  borderRadius: '5px',
  border: '1px solid #ccc',
  minHeight: '3rem',
}

const rightText = {
  textAlign: 'right' as 'right',
  padding: '.3rem',
  margin: '.5rem',
  backgroundColor: 'lightblue',
  borderRadius: '5px',
  border: '1px solid #ccc',
  minHeight: '3rem',
}
