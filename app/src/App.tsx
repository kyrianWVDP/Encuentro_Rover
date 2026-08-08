import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicScreen } from "./ui/PublicScreen";
import { HostScreen } from "./ui/HostScreen";
import { SetupScreen } from "./ui/SetupScreen";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<PublicScreen />} />
        <Route path="/host" element={<HostScreen />} />
        <Route path="/setup" element={<SetupScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
