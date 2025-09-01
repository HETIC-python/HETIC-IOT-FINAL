import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import AdminDashboard from "./pages/admin";
import OrdersPage from "./pages/admin/OrdersPage";
import SensorsPage from "./pages/admin/SensorsPage";
import TaskPage from "./pages/admin/TaskPage";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminUsers from "./pages/admin/Users";
import AdminWorkspacePage from "./pages/admin/Workspace";
import AdminWorkspacesPage from "./pages/admin/WorkspacesPage";
import HomePage from "./pages/HomePage";
import { KitPage } from "./pages/KitPage";
import SignIn from "./pages/Sigin";
import { SuccessPage } from "./pages/SuccessPage";
import ValidateAccount from "./pages/Validate";

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kit" element={<KitPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/validate" element={<ValidateAccount />} />

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
            <Route
              path="/admin/tasks"
              element={
                <PrivateRoute requiredRole="admin">
                  <TaskPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute requiredRole="admin">
                  <OrdersPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
