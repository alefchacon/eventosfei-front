import { useState } from "react";

export default function useTitle() {
  const [title, setTitle] = useState("Calendario");

  return { title, setTitle };
}
