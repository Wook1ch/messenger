import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import './styles/theme.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-wrapper">
      {!user ? (
        <LoginPage onLogin={u => setUser(u)} />
      ) : (
        <ChatPage username={user.email} />
      )}
    </div>
  );
}

export default App;
