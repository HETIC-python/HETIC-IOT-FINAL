import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PrivateRoute } from "./components/PrivateRoute";
import SensorsPage from "./pages/admin/SensorsPage";
import AdminWorkspacePage from "./pages/admin/Workspace";
import AdminWorkspacesPage from "./pages/admin/WorkspacesPage";
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
        <Route
          path="/admin/workspaces"
          element={
            <PrivateRoute role="admin">
              <AdminWorkspacesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/workspaces/:id"
          element={
            <PrivateRoute role="admin">
              <AdminWorkspacePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/sensors"
          element={
            <PrivateRoute role="admin">
              <SensorsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
