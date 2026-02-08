// src/pages/AllChatsPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export default function AllChatsPage() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  // Получаем текущего пользователя
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

  // Загрузка всех чатов
  const loadChats = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("messages")
      .select(`
        friend_id,
        content,
        created_at,
        profiles(username, avatar)
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Сгруппировать по собеседнику
      const grouped = {};
      data.forEach(msg => {
        const friendId = msg.friend_id === userId ? msg.user_id : msg.friend_id;
        if (!grouped[friendId]) grouped[friendId] = [];
        grouped[friendId].push(msg);
      });

      // Преобразуем в массив с последним сообщением
      const chatList = Object.keys(grouped).map(fid => {
        const msgs = grouped[fid];
        const lastMsg = msgs[msgs.length - 1];
        return {
          friendId: fid,
          lastMessage: lastMsg.content,
          updatedAt: lastMsg.created_at,
          friendProfile: lastMsg.profiles || {},
        };
      });

      setChats(chatList);
    } else if (error) console.error(error.message);
  };

  useEffect(() => {
    loadChats();
  }, [userId]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2,"0")}:${date.getMinutes().toString().padStart(2,"0")}`;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
      color: "#fff",
      padding: 10,
      boxSizing: "border-box"
    }}>
      <h2>Все чаты</h2>
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: 60 }}>
        {chats.map(chat => (
          <div
            key={chat.friendId}
            onClick={() => navigate(`/chat/${chat.friendId}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              marginBottom: 8,
              borderRadius: 10,
              backgroundColor: "#3a3f5c",
              cursor: "pointer"
            }}
          >
            {/* Аватар */}
            <img
              src={chat.friendProfile.avatar || "https://via.placeholder.com/40"}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>{chat.friendProfile.username || "User"}</div>
              <div style={{ fontSize: "0.9rem", color: "#ddd" }}>{chat.lastMessage}</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#bbb" }}>
              {formatTime(chat.updatedAt)}
            </div>
          </div>
        ))}
        {chats.length === 0 && <p>Чаты отсутствуют</p>}
      </div>

      <button
        onClick={() => navigate("/chat")}
        style={{
          position: "fixed",
          bottom: 70,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#3a3f5c",
          cursor: "pointer"
        }}
      >
        Вернуться в чат
      </button>
    </div>
  );
}
