import { Dog, Cat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <h1 className="flex text-amber-500 text-6xl">
        <Dog className="size-15" />
        Home <Cat className="size-15" />
      </h1>
      <div>
        <Button>
          <Link to="/login">Logar</Link>
        </Button>
        <Button>
          <Link to="/register">Registrar</Link>
        </Button>
      </div>
    </div>
  );
}
