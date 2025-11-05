import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LogoutButton = ({ compact = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Sei sicuro di voler uscire?");
    if (!confirmLogout) return;

    logout();
    toast.success("Logout effettuato con successo!");
    navigate("/");
  };

  const sharedStyles = "flex items-center gap-2 font-semibold transition";

  // ✅ Versione compatta per mobile o forzata
  if (compact || isMobile) {
    return (
      <button
        onClick={handleLogout}
        className={`${sharedStyles} text-sm text-red-400 hover:text-red-300`}
      >
        <LogOut size={16} />
        Logout
      </button>
    );
  }

  // ✅ Versione desktop stile pulsanti profilo
  return (
    <button
      onClick={handleLogout}
      className={`${sharedStyles} logout-button`} // usa classe già esistente del profilo
    >
      <LogOut size={16} />
      Esci
    </button>
  );
};

export default LogoutButton;
