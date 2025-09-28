import { api } from "@/service/api";
import { useAuth } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { logout } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    try {
      await api.post("/auth/logout");
    } catch {}
    logout();
    nav("/login", { replace: true });
  }

  return <button onClick={onLogout}>Logout</button>;
}
