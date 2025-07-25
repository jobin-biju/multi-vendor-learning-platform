import React, { useEffect, useState } from "react";
import { Send, ArrowLeft, Users, MessageCircle, Search, MoreVertical } from "lucide-react";

function LearnersChat() {
  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem("tourstorage")));

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const response = await fetch("http://localhost:4000/chat/getVendors");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching learners:", error);
      }
    };
    fetchLearners();
  }, []);

  useEffect(() => {
    if (!receiverId || !auth?._id) return;
    const fetchChat = async () => {
      try {
        const response = await fetch("http://localhost:4000/chat/getChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: auth._id,
            receiverId,
          }),
        });
        const data = await response.json();
        setChat(data || []);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setChat([]);
      }
    };
    fetchChat();
  }, [receiverId, auth]);
  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const sendMessage = async () => {
    if (!message.trim() || !receiverId) return;
    try {
      await fetch("http://localhost:4000/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: auth._id,
          receiverId,
          message,
        }),
      });
      setMessage("");
      const response = await fetch("http://localhost:4000/chat/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: auth._id,
          receiverId,
        }),
      });
      const data = await response.json();
      setChat(data || []);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.vendorid?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const navigateBack = () => {
    // Navigate back functionality
    window.history.back();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-lg">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={index}
                onClick={() => {
                  setReceiverId(user._id);
                  setReceiverName(user.vendorid?.name || "Unknown");
                }}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 ${
                  receiverId === user._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.vendorid?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {user.vendorid?.name || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">Active now</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4">
            {receiverName ? (
              <>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {receiverName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800 text-lg">{receiverName}</h2>
                  {/* <p className="text-sm text-green-500">Online</p> */}
                </div>
              </>
            ) : (
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 text-lg">Select a conversation</h2>
                <p className="text-sm text-gray-500">Choose someone to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {chat.length > 0 ? (
            <div className="space-y-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.senderId === auth._id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                      msg.senderId === auth._id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.senderId === auth._id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                       {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : receiverId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No messages yet</p>
                <p className="text-gray-400 text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h3>
                <p className="text-gray-500">Select a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        {receiverId && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnersChat;