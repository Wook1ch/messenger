// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // для перенаправления
import { supabase } from "../api/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // хук для перехода на другую страницу

  // hover состояния для анимации
  const [hoverSignup, setHoverSignup] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);

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
      setTimeout(() => navigate("/chat"), 1500);
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
      setTimeout(() => navigate("/chat"), 500);
    }
  };

  // функция для стилей кнопок с hover
  const buttonStyle = (hover) => ({
    marginRight: 10,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: hover ? "#5a5fe0" : "#3a3f5c", // меняем цвет при hover
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease", // плавная анимация
    transform: hover ? "scale(1.05)" : "scale(1)", // слегка увеличиваем
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to bottom, #0d1b4c, #2e0f5a)", // градиентный фон
      }}
    >
      <h1>Тяни за писюн кронк</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          margin: 5,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #502974",
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
          style={buttonStyle(hoverSignup)}
          onMouseEnter={() => setHoverSignup(true)}
          onMouseLeave={() => setHoverSignup(false)}
        >
          Зарегистрироваться
        </button>

        <button
          onClick={handleLogin}
          style={buttonStyle(hoverLogin)}
          onMouseEnter={() => setHoverLogin(true)}
          onMouseLeave={() => setHoverLogin(false)}
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
