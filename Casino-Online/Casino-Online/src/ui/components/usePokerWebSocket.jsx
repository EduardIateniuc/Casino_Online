import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";

export const usePokerWebSocket = (newRoomName, inputMessage) => {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  
  const API_BASE_URL = "http://192.168.100.76:8080";
  const WS_URL = "ws://192.168.100.76:8080/ws";

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!roomId) return;
    
    setMessages([]);
    
    const client = new Client({
      brokerURL: WS_URL,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log(`Connected to room: ${roomId}`);
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, parsedMessage]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker error: " + frame.headers["message"]);
      },
      reconnectDelay: 5000,
    });

    client.activate();
    setStompClient(client);
    
    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [roomId]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const sendMessage = (content) => {
    if (stompClient && stompClient.connected && content.trim()) {
      const message = { 
        sender: "User", 
        content: content, 
        roomId: roomId,
        timestamp: new Date().toISOString()
      };
      
      stompClient.publish({
        destination: `/app/room/${roomId}`,
        body: JSON.stringify(message),
      });
    }
  };

  const createRoom = async () => {
    if (newRoomName.trim()) {
      try {
        const response = await axios.post(`${API_BASE_URL}/rooms/create`, { 
          name: newRoomName 
        });
        setRooms([...rooms, response.data]);
        return response.data;
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  return {
    rooms,
    roomId,
    messages,
    setRoomId,
    sendMessage,
    createRoom
  };
};