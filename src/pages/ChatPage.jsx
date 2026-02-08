// src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../api/supabase";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Получаем текущего пользователя
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return console.error("Ошибка получения пользователя:", error.message);
      if (data?.user) {
        setUsername(data.user.email || "Anon");
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  // 2. Загружаем все сообщения
  const loadMessages = async () => {
    try {
      // Подключаем связь с профилями (avatars, username)
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          user_id,
          content,
          created_at,
          profiles (
            username,
            avatar
          )
        `)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("Ошибка загрузки сообщений:", err.message);
    }
  };

  // 3. Автообновление каждые 2 сек
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // 4. Прокрутка вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 5. Отправка нового сообщения
  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          user_id: userId,
          content: newMessage,
        },
      ]);

      if (error) throw error;

      setNewMessage("");
      loadMessages(); // обновляем чат
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err.message);
    }
  };

  // 6. Форматирование времени
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        padding: 20,
        background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
      }}
    >
      {/* Контейнер сообщений */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 10,
          borderRadius: 8,
          background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              position: "relative",
              marginBottom: 6,
              padding: "5px 8px",
              borderRadius: 12,
              backgroundColor: "#555555",
              color: "#fff",
              maxWidth: "40%",
              wordBreak: "break-word",
            }}
          >
            <div style={{ fontSize: "0.8rem" }}>{msg.content}</div>
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

      {/* Отправка сообщения */}
      <div style={{ display: "flex", gap: 10 }}>
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
    </div>
  );
}
