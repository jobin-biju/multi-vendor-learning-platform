import React, { useEffect, useState } from "react";
import axios from "axios";

function Chat() {
    const [chat, setChat] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [auth] = useState(JSON.parse(localStorage.getItem("tourstorage")));


    useEffect(() => {
        const fetchLearners = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/chat/getlearner"
                );
                setUsers(response.data);
                console.log("Fetched learners:", response.data);
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
                const response = await axios.post(
                    "http://localhost:4000/chat/getChat",
                    {
                        senderId: auth._id,
                        receiverId: receiverId,
                    }
                );
                setChat(response.data || []);
            } catch (error) {
                console.error("Error fetching chat:", error);
                setChat([]);
            }
        };

        fetchChat();
    }, [receiverId, auth]);

    const sendMessage = async () => {
        if (!message.trim() || !receiverId) return;
        try {
            await axios.post("http://localhost:4000/chat/send", {
                senderId: auth._id,
                receiverId,
                message,
            });
            setMessage(""); // clear input
            // Refresh chat after sending
            const response = await axios.post("http://localhost:4000/chat/getChat", {
                senderId: auth._id,
                receiverId: receiverId,
            });
            setChat(response.data || []);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Sidebar */}
                <div className="col-md-4 border-end d-flex flex-column">
                    <div className="p-3 bg-light fw-bold border-bottom">Chats</div>
                    <div className="overflow-auto flex-grow-1">
                        {users.map((user, index) => (
                            <div
                                key={index}
                                className="p-3 border-bottom cursor-pointer"
                                onClick={() => {
                                    setReceiverId(user._id);
                                    setReceiverName(user.vendorid?.name || "Unknown");
                                }}
                            >
                                <div className="fw-semibold">{user.vendorid?.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="col-md-8 d-flex flex-column">
                    {/* Header */}
                    <div className="p-3 bg-light fw-bold border-bottom">
                        {receiverName || "Select a user to start chat"}
                    </div>

                    {/* Messages */}
                    <div
                        className="flex-grow-1 p-3 overflow-auto bg-white"
                        style={{ minHeight: 0 }}
                    >
                        {chat.length > 0 ? (
                            chat.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`d-flex mb-2 ${msg.senderId === auth._id
                                        ? "justify-content-end"
                                        : "justify-content-start"
                                        }`}
                                >
                                    <div
                                        className={`p-2 rounded ${msg.senderId === auth._id
                                            ? "bg-success text-white"
                                            : "bg-light"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted">No messages yet</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-top p-3 d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button className="btn btn-success" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
