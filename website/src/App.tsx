import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./pages/admin";
import SensorsPage from "./pages/admin/SensorsPage";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminUsers from "./pages/admin/Users";
import AdminWorkspacePage from "./pages/admin/Workspace";
import AdminWorkspacesPage from "./pages/admin/WorkspacesPage";
import HomePage from "./pages/HomePage";
import { KitPage } from "./pages/KitPage";
import SignIn from "./pages/Sigin";
import { SuccessPage } from "./pages/SuccessPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kit" element={<KitPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/workspaces"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminWorkspacesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/workspaces/:id"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminWorkspacePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/sensors"
            element={
              <PrivateRoute requiredRole="admin">
                <SensorsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/sensors"
            element={
              <PrivateRoute requiredRole="admin">
                <SensorsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminUserDetails />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
