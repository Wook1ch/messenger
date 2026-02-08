import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Фиктивный получатель для теста (UUID второго пользователя)
  const receiverId = "ebd2d5b6-85e6-4de8-a3b4-05d904191688";

  // ---------- Получаем текущего пользователя ----------
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return console.error(error.message);

      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  // ---------- Автопрокрутка ----------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------- Загрузка сообщений ----------
  const loadMessages = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки сообщений:", error.message);
      return;
    }

    setMessages(data);
    setTimeout(scrollToBottom, 50);
  }, [userId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // ---------- Отправка сообщения ----------
  const handleSend = async () => {
    if (!newMessage.trim() || !userId) {
      console.warn("Сообщение не отправлено: нет данных");
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      sender_id: userId,
      receiver_id: receiverId,
      content: newMessage,
    });

    if (error) {
      console.error("Ошибка отправки:", error.message);
      return;
    }

    setNewMessage("");
    loadMessages();
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  // ---------- UI ----------
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
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg) => {
          const isMine = msg.sender_id === userId;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                backgroundColor: isMine ? "#4b7bec" : "#555",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 10,
                marginBottom: 6,
                maxWidth: "35%",
                wordBreak: "break-word",
              }}
            >
              <div>{msg.content}</div>
              <div
                style={{
                  fontSize: "0.65rem",
                  textAlign: "right",
                  opacity: 0.7,
                }}
              >
                {formatTime(msg.created_at)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Ввод */}
      <div style={{ display: "flex", gap: 10, marginBottom: 60 }}>
        <input
          value={newMessage}
          placeholder="Введите сообщение..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flexGrow: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #3a3f5c",
            backgroundColor: "#1a1f2c",
            color: "#fff",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            backgroundColor: "#3a3f5c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </div>

      {/* Нижняя панель */}
      <div style={bottomBar}>
        <div onClick={() => navigate("/profile")} style={buttonStyle}>⚙️</div>
        <div style={buttonStyle}>📞</div>
        <div style={buttonStyle}>👤</div>
        <div onClick={() => navigate("/all-chats")} style={buttonStyle}>💬</div>
      </div>
    </div>
  );
}

const bottomBar = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: 60,
  backgroundColor: "#4b2e7f",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
};

const buttonStyle = {
  cursor: "pointer",
  padding: 10,
};
