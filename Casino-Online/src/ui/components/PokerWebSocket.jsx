import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const PokerWebSocket = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws", 
      connectHeaders: {
        login: "guest",
        passcode: "guest",
      },
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log(`Connected to room: ${roomId}`);
        client.subscribe(`/room/${roomId}`, (message) => {
          setMessages((prev) => [...prev, JSON.parse(message.body)]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && input.trim()) {
      const message = { sender: "User", content: input, roomId };
      stompClient.publish({
        destination: `/app/room/${roomId}`,
        body: JSON.stringify(message),
      });
      setInput("");
    }
  };

  let ws = new WebSocket("ws://localhost:8080/ws");
  ws.onopen = () => console.log("Connected!");
  ws.onerror = (err) => console.error("WebSocket Error:", err);


  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}><strong>{msg.sender}:</strong> {msg.content}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default PokerWebSocket;
