// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Загрузка данных пользователя
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);

        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar")
          .eq("id", user.id)
          .single();

        if (error) console.error(error.message);
        else if (data) {
          setUsername(data.username);
          setAvatarUrl(data.avatar || "");
        }
      }
    };
    loadProfile();
  }, []);

  // Сохранение изменений
  const handleSave = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ username, avatar: avatarUrl })
      .eq("id", supabase.auth.getUser().then(u => u.data.user.id));

    if (error) setMessage(error.message);
    else setMessage("Профиль обновлен!");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)",
      color: "#fff",
      padding: 20
    }}>
      <h2>Профиль</h2>
      <p>Email: {email}</p>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: 10, padding: 8, borderRadius: 8, width: 250 }}
      />

      <input
        type="text"
        placeholder="Avatar URL"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        style={{ margin: 10, padding: 8, borderRadius: 8, width: 250 }}
      />

      <button
        onClick={handleSave}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#3a3f5c",
          cursor: "pointer"
        }}
      >
        Сохранить
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <button
        onClick={() => navigate("/chat")}
        style={{
          marginTop: 20,
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#555",
          cursor: "pointer"
        }}
      >
        Вернуться в чат
      </button>
    </div>
  );
}
