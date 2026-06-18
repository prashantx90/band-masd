
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { DirectusAuthProvider } from "./context/DirectusAuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <DirectusAuthProvider>
    <App />
  </DirectusAuthProvider>
);