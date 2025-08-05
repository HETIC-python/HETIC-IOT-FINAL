import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import HomePage from "./pages/HomePage";
import { KitPage } from "./pages/KitPage";
import { SuccessPage } from "./pages/SuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kit" element={<KitPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
