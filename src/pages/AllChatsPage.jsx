// src/pages/AllChatsPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export default function AllChatsPage() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  // Загружаем всех пользователей (кроме текущего)
  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar, email");

      if (error) console.error("Ошибка загрузки профилей:", error.message);
      else setProfiles(data || []);
    };

    loadProfiles();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 20 }}>Все чаты</h2>
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => navigate(`/chat/${profile.id}`)} // Переход в чат с этим пользователем
            style={{
              display: "flex",
              alignItems: "center",
              padding: 10,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: "#3a3f5c",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#888",
                backgroundImage: profile.avatar ? `url(${profile.avatar})` : "",
                backgroundSize: "cover",
                marginRight: 10,
              }}
            />
            <div style={{ color: "#fff", fontWeight: "bold" }}>
              {profile.username || profile.email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
