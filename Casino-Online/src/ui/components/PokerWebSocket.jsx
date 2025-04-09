import { useState } from "react";
import { usePokerWebSocket } from "./usePokerWebSocket";

const PokerWebSocket = () => {
  const [newRoomName, setNewRoomName] = useState("");
  const [input, setInput] = useState("");
  
  const { 
    rooms, 
    roomId, 
    messages, 
    setRoomId, 
    sendMessage, 
    createRoom 
  } = usePokerWebSocket(newRoomName, input);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom();
      setNewRoomName("");
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar with rooms */}
        <div className="bg-indigo-950/50 rounded-xl shadow-xl p-4 lg:col-span-1 border border-indigo-700/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300">Poker Rooms</h2>
          
          {/* Create room form */}
          <div className="mb-6 bg-indigo-900/40 p-4 rounded-lg border border-indigo-700/30">
            <h3 className="text-lg font-semibold mb-2 text-indigo-200">Create New Room</h3>
            <div className="flex gap-2">
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleCreateRoom)}
                placeholder="Room name"
                className="flex-1 rounded bg-indigo-800/50 border border-indigo-600 px-3 py-2 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleCreateRoom}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded transition-colors duration-200"
              >
                Create
              </button>
            </div>
          </div>
          
          {/* Room list */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <button
                  key={room.roomId}
                  onClick={() => setRoomId(room.roomId)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    roomId === room.roomId
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-800/40 hover:bg-indigo-700/60 text-indigo-200"
                  }`}
                >
                  <span className="font-medium">{room.name}</span>
                  <span className="text-xs opacity-75 ml-2">#{room.roomId}</span>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-indigo-400">
                No rooms available. Create one to get started!
              </div>
            )}
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="bg-indigo-950/50 rounded-xl shadow-xl p-4 lg:col-span-2 border border-indigo-700/30 backdrop-blur-sm flex flex-col h-[36rem]">
          {roomId ? (
            <>
              <div className="mb-4 pb-3 border-b border-indigo-800">
                <h2 className="text-xl font-bold text-indigo-300">
                  Room: {rooms.find(r => r.roomId === roomId)?.name || roomId}
                </h2>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
                {messages.length > 0 ? (
                  <ul className="space-y-3">
                    {messages.map((msg, index) => (
                      <li 
                        key={index} 
                        className={`px-4 py-3 rounded-lg max-w-[80%] ${
                          msg.sender === "User" 
                            ? "bg-indigo-600 ml-auto" 
                            : "bg-indigo-800/70"
                        }`}
                      >
                        <div className="font-semibold text-xs text-indigo-300 mb-1">
                          {msg.sender}
                        </div>
                        <div>{msg.content}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex items-center justify-center text-indigo-400">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSendMessage)}
                  placeholder="Type your message..."
                  className="flex-1 rounded bg-indigo-800/50 border border-indigo-600 px-4 py-3 text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xl font-medium">Select a room to start chatting</p>
              <p className="text-indigo-400 mt-2">Or create a new one from the sidebar</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(79, 70, 229, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.7);
        }
      `}</style>
    </div>
  );
};

export default PokerWebSocket;