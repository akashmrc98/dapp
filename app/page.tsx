"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.29.208:8000/ws");
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      console.log(event);
      setMessages((prevMessages: any) => [...prevMessages, {message:event.data, is_mine:false}]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(input);
      setMessages((prevMessages: any) => [...prevMessages, {message:input, is_mine:true}]);
      setInput("");
    }
  };

  const chatSeperator = (is_mine: boolean) => (is_mine ? `items-end` : ``);

  type Props = {
    message: string;
  };

  const ChatBox = (props: Props) => {
    return (
      <div className={`w-1/3 text-3xl`}>
        <div className="flex flex-row items-center">
          <img
            src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
            className="w-10 h-10 rounded-full"
            alt="avatar"
          ></img>
          <div className="bg-blue-400 p-4 m-1 rounded-lg">
            {`${props.message}`}
          </div>
        </div>
      </div>
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col bg-blue-800 w-full h-full shadow-sm rounded-md p-4">
        {messages.map((message, i) => (
          <div key={i}>
            <div className={`flex flex-col ${chatSeperator(message.is_mine)}`}>
              <ChatBox message={message.message} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center px-4">
        <input
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 bg-blue-200 text-blue-900 font-bold"
        ></input>
        <button
          onClick={() => sendMessage()}
          className="h-full p-4 m-2 w-1/6 bg-blue-800 text-3xl"
        >
          Send
        </button>
      </div>
    </main>
  );
}
