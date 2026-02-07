// src/pages/LoginPage.jsx
import { useState } from "react";
import { supabase } from "../api/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Регистрация
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Регистрация успешна! Проверь почту.");
    }
  };

  // Вход
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Вы вошли в систему!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#1a1f2c",
        color: "#fff",
        padding: 20,
        borderRadius: 10,
      }}
    >
      <h1>Вход / Регистрация</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          margin: 5,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #3a3f5c",
          width: 250,
        }}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          margin: 5,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #3a3f5c",
          width: 250,
        }}
      />

      <div style={{ marginTop: 10 }}>
        <button
          onClick={handleSignup}
          style={{
            marginRight: 10,
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#3a3f5c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Зарегистрироваться
        </button>

        <button
          onClick={handleLogin}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#3a3f5c",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Войти
        </button>
      </div>

      {message && (
        <div style={{ marginTop: 15, color: "#a0e0a0" }}>{message}</div>
      )}
    </div>
  );
}
