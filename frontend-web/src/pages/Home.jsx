import { Dog, Cat } from "lucide-react";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="flex text-amber-500 text-6xl">
        <Dog className="size-15" />
        Hello World <Cat className="size-15" />
      </h1>
      <Button> Click me </Button>
    </div>
  );
}

export default Home;
