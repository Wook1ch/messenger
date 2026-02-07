import { useState } from "react";
import { supabase } from "../api/supabase";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Функция регистрации
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Регистрация успешна! Проверь почту");
  };

  // Функция входа
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else onLogin(data.user);
  };

  return (
    <div className="login-container">
      <h1>Вход / Регистрация</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Войти</button>
      <button onClick={handleSignup}>Регистрация</button>

      <p style={{ color: "#ff8080", marginTop: 10 }}>{message}</p>
    </div>
  );
}
