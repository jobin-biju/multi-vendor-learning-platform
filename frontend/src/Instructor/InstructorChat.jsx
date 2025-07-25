import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat() {
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem("tourstorage")));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const response = await axios.get("http://localhost:4000/chat/getlearner");
        setUsers(response.data);
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
        const response = await axios.post("http://localhost:4000/chat/getChat", {
          senderId: auth._id,
          receiverId,
        });
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
    setIsTyping(true);
    try {
      await axios.post("http://localhost:4000/chat/send", {
        senderId: auth._id,
        receiverId,
        message,
      });
      setMessage("");
      const response = await axios.post("http://localhost:4000/chat/getChat", {
        senderId: auth._id,
        receiverId,
      });
      setChat(response.data || []);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.vendorid?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    
    sidebar: {
      width: "350px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255, 255, 255, 0.2)",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
    
    sidebarHeader: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "24px",
      color: "white",
    },
    
    headerTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    
    titleText: {
      fontSize: "24px",
      fontWeight: "700",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    
    searchContainer: {
      position: "relative",
    },
    
    searchInput: {
      width: "100%",
      padding: "12px 16px 12px 45px",
      borderRadius: "25px",
      border: "none",
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.3s ease",
    },
    
    searchIcon: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "16px",
    },
    
    usersList: {
      flex: 1,
      overflowY: "auto",
      padding: "8px 0",
    },
    
    userItem: {
      padding: "16px 20px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    
    userItemHover: {
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
      transform: "translateX(5px)",
    },
    
    userItemActive: {
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)",
      borderLeft: "4px solid #667eea",
    },
    
    userProfile: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    
    userAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "18px",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    
    userInfo: {
      flex: 1,
    },
    
    userName: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "4px",
    },
    
    userStatus: {
      fontSize: "13px",
      color: "#718096",
    },
    
    chatWindow: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
    },
    
    chatHeader: {
      padding: "20px 24px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    
    chatHeaderLeft: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    
    backButton: {
      padding: "8px",
      borderRadius: "50%",
      border: "none",
      background: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    
    chatAvatar: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    
    chatUserInfo: {
      display: "flex",
      flexDirection: "column",
    },
    
    chatUserName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#2d3748",
      margin: 0,
    },
    
    onlineStatus: {
      fontSize: "13px",
      color: "#48bb78",
      fontWeight: "500",
    },
    
    chatActions: {
      display: "flex",
      gap: "8px",
    },
    
    actionButton: {
      padding: "10px",
      borderRadius: "50%",
      border: "none",
      background: "rgba(102, 126, 234, 0.1)",
      color: "#667eea",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    
    messagesContainer: {
      flex: 1,
      padding: "24px",
      overflowY: "auto",
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
      `,
    },
    
    messageRow: {
      display: "flex",
      marginBottom: "16px",
      animation: "slideIn 0.3s ease-out",
    },
    
    senderMessage: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "12px 18px",
      borderRadius: "20px 20px 5px 20px",
      maxWidth: "70%",
      fontSize: "15px",
      lineHeight: "1.4",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
      position: "relative",
      wordWrap: "break-word",
    },
    
    receiverMessage: {
      alignSelf: "flex-start",
      background: "white",
      color: "#2d3748",
      padding: "12px 18px",
      borderRadius: "20px 20px 20px 5px",
      maxWidth: "70%",
      fontSize: "15px",
      lineHeight: "1.4",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      position: "relative",
      wordWrap: "break-word",
    },
    
    messageTime: {
      fontSize: "11px",
      opacity: 0.7,
      marginTop: "4px",
      textAlign: "right",
    },
    
    emptyState: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: "#718096",
    },
    
    emptyIcon: {
      fontSize: "64px",
      marginBottom: "16px",
      opacity: 0.5,
    },
    
    emptyTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    
    emptyText: {
      fontSize: "14px",
      textAlign: "center",
      maxWidth: "300px",
    },
    
    inputContainer: {
      padding: "20px 24px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(0, 0, 0, 0.1)",
    },
    
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    
    messageInput: {
      flex: 1,
      padding: "14px 20px",
      borderRadius: "25px",
      border: "2px solid rgba(102, 126, 234, 0.2)",
      background: "rgba(255, 255, 255, 0.8)",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
    },
    
    sendButton: {
      padding: "14px",
      borderRadius: "50%",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    },
    
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      transform: "none",
    },
    
    typingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 18px",
      background: "white",
      borderRadius: "20px 20px 20px 5px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      alignSelf: "flex-start",
      marginBottom: "16px",
    },
    
    typingDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#718096",
      animation: "bounce 1.4s ease-in-out infinite both",
    },
  };

  const [hoveredUser, setHoveredUser] = useState(null);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.headerTitle}>
            <h1 style={styles.titleText}>
              💬 Chats
            </h1>
            <button style={styles.actionButton}>⋮</button>
          </div>
          
          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>🔍</div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.usersList}>
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              style={{
                ...styles.userItem,
                ...(hoveredUser === index ? styles.userItemHover : {}),
                ...(receiverId === user._id ? styles.userItemActive : {}),
              }}
              onMouseEnter={() => setHoveredUser(index)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => {
                setReceiverId(user._id);
                setReceiverName(user.vendorid?.name || "Unknown");
              }}
            >
              <div style={styles.userProfile}>
                <div style={styles.userAvatar}>
                  {user.vendorid?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>
                    {user.vendorid?.name || 'Unknown User'}
                  </div>
                  <div style={styles.userStatus}>
                    Click to start chatting
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderLeft}>
            {receiverId && (
              <button
                style={styles.backButton}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => e.target.style.background = "rgba(102, 126, 234, 0.2)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(102, 126, 234, 0.1)"}
              >
                ←
              </button>
            )}
            {receiverName ? (
              <>
                <div style={styles.chatAvatar}>
                  {receiverName.charAt(0).toUpperCase()}
                </div>
                <div style={styles.chatUserInfo}>
                  <h2 style={styles.chatUserName}>{receiverName}</h2>
                  <div style={styles.onlineStatus}>● Online</div>
                </div>
              </>
            ) : (
              <div style={{ color: '#718096', fontSize: '16px' }}>
                Select a user to start chatting
              </div>
            )}
          </div>
          
          {receiverId && (
            <div style={styles.chatActions}>
              <button style={styles.actionButton}>📞</button>
              <button style={styles.actionButton}>📹</button>
              <button style={styles.actionButton}>⋮</button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {receiverId ? (
            chat.length > 0 ? (
              <>
                {chat.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.messageRow,
                      justifyContent: msg.senderId === auth._id ? "flex-end" : "flex-start",
                    }}
                  >
                    <div style={msg.senderId === auth._id ? styles.senderMessage : styles.receiverMessage}>
                      {msg.message}
                      <div style={styles.messageTime}>
                       {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={styles.typingIndicator}>
                    <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
                    <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
                    <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
                  </div>
                )}
              </>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <div style={styles.emptyTitle}>No messages yet</div>
                <div style={styles.emptyText}>Start the conversation by sending a message!</div>
              </div>
            )
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>👥</div>
              <div style={styles.emptyTitle}>Welcome to Chat</div>
              <div style={styles.emptyText}>
                Select a conversation from the sidebar to start messaging
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        {receiverId && (
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                style={{
                  ...styles.messageInput,
                  borderColor: message.trim() ? "#667eea" : "rgba(102, 126, 234, 0.2)",
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = message.trim() ? "#667eea" : "rgba(102, 126, 234, 0.2)"}
              />
              <button
                style={{
                  ...styles.sendButton,
                  ...(message.trim() ? {} : styles.sendButtonDisabled),
                  transform: message.trim() ? "scale(1.05)" : "scale(1)",
                }}
                onClick={sendMessage}
                disabled={!message.trim()}
                onMouseEnter={(e) => {
                  if (message.trim()) {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (message.trim()) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }
      `}</style>
    </div>
  );
}

export default Chat;