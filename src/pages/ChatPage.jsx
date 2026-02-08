import { useEffect, useState, useRef } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Загрузка текущего пользователя
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return console.error(error.message);
      if (data?.user) {
        setUsername(data.user.email || "Anon");
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  // Загрузка сообщений
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) {
      setMessages(data);
      scrollToBottom();
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;
    const { error } = await supabase.from("messages").insert([
      { user_id: userId, username: username || "Anon", content: newMessage },
    ]);
    if (!error) {
      setNewMessage("");
      loadMessages();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      {/* Сообщения */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 5,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              position: "relative",
              marginBottom: 6,
              padding: "5px 7px",
              borderRadius: 10,
              backgroundColor: "#555555",
              color: "#fff",
              maxWidth: "35%",
              wordBreak: "break-word",
            }}
          >
            <div style={{ fontSize: "0.9rem" }}>{msg.content}</div>
            <span
              style={{
                position: "absolute",
                bottom: 2,
                right: 4,
                fontSize: "0.6rem",
                color: "#ddd",
              }}
            >
              {formatTime(msg.created_at)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Ввод сообщения */}
      <div style={{ display: "flex", gap: 10, marginBottom: 60 }}>
        <input
          type="text"
          value={newMessage}
          placeholder="Введите сообщение..."
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flexGrow: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #3a3f5c",
            backgroundColor: "#1a1f2c",
            color: "#fff",
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#3a3f5c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </div>

      {/* Нижняя панель */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 60,
          backgroundColor: "#4b2e7f",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          boxShadow: "0 -2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {/* Кнопка Профиль */}
        <div
          onClick={() => navigate("/profile")}
          style={{
            cursor: "pointer",
            padding: 10,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⚙️
        </div>

        {/* Кнопка Звонки */}
        <div
          onClick={() => alert("Звонки пока не реализованы")}
          style={{
            cursor: "pointer",
            padding: 10,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📞
        </div>

        {/* Кнопка Контакты */}
        <div
          onClick={() => alert("Контакты пока не реализованы")}
          style={{
            cursor: "pointer",
            padding: 10,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          👤
        </div>

        {/* Кнопка Все чаты */}
        <div
  onClick={() => navigate("/all-chats")}
  style={{
    cursor: "pointer",
    padding: 10,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  💬
</div>

      </div>
    </div>
  );
}
