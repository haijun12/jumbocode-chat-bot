import { useState } from "react";


interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({ setIsLoggedIn }: LoginProps) {
  const [password, setPassword] = useState("");

    
  const validatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === "") {
      alert("Please enter a password");
    } else {
      const response = await fetch('/api/validateUser', {
        method: 'POST',
        body: JSON.stringify({ password: password}),
        headers: {
            'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      if (data == true) {
        setIsLoggedIn(true);
      } else {
        alert("Incorrect password, please try again");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 h-dvh">
      <h1 className="text-2xl mb-4">Enter using password</h1>
      <form onSubmit={validatePassword} className="px-4 rounded-md bg-white shadow-sm">
        <input
          className="bg-inherit p-2 focus:outline-none"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-inherit p-2 rounded-md hover:text-blue-500">
          <span>&gt;&gt;&gt;</span>
        </button>
      </form>
    </div>
  );
}