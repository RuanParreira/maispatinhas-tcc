import { Dog, Cat } from "lucide-react";

export default function Adoptions() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="flex text-amber-500 text-6xl">
        <Dog className="size-15" />
        Hello World
        <Cat className="size-15" />
      </h1>
    </div>
  );
}
