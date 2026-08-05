import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicScreen } from "./ui/PublicScreen";
import { HostScreen } from "./ui/HostScreen";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicScreen />} />
        <Route path="/host" element={<HostScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
