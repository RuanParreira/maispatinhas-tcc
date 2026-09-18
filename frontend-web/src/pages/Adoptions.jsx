import { Dog, Cat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function Adoptions() {
  const navigate = useNavigate();

  async function handleLogout() {
    await api.post("/api/logout");
    navigate("/login");
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <h1 className="flex text-amber-500 text-6xl">
        <Dog className="size-15" />
        Hello World <Cat className="size-15" />
      </h1>
      <Button onClick={handleLogout}> Sair </Button>
    </div>
  );
}
