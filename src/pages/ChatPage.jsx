import { useEffect, useState } from "react";
import { supabase } from "../api/supabase";

export default function ChatPage({ username }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      setMessages(data || []);
    }

    loadMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => setMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const sendMessage = async () => {
    if (!newMessage) return;
    await supabase.from("messages").insert([{ username, content: newMessage }]);
    setNewMessage("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Чат</h2>

      <div className="message-container">
        {messages.map(m => (
          <div
            key={m.id}
            className={`message ${m.username === username ? "own" : ""}`}
          >
            <strong>{m.username}: </strong>{m.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 12, gap: 6 }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Напиши сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}
