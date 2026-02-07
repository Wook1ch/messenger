import { useState } from "react";
import { supabase } from "../api/supabase";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else onLogin(data.user);
  };

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Регистрация успешна! Проверь почту");
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

      <p style={{ marginTop: 10, color: "#ff8080" }}>{message}</p>
    </div>
  );
}
