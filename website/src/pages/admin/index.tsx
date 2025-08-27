import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-gray-600">Manage system users</p>
        </Link>
        <Link
          to="/admin/rooms"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Room Management</h2>
          <p className="text-gray-600">Manage rooms and spaces</p>
        </Link>
        <Link
          to="/admin/devices"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Device Management</h2>
          <p className="text-gray-600">Manage IoT devices</p>
        </Link>
        <Link
          to="/admin/settings"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-gray-600">System configuration</p>
        </Link>
        <Link
          to="/admin/workspaces"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Workspace Management</h2>
          <p className="text-gray-600">Manage workspaces and teams</p>
        </Link>
        <Link
          to="/admin/sensors"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Sensor Management</h2>
          <p className="text-gray-600">Manage IoT sensors</p>
        </Link>
        <Link
          to="/admin/tasks"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Task Management</h2>
          <p className="text-gray-600">Manage tasks and assignments</p>
        </Link>
        <Link
          to="/admin/orders"
          className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">Orders Management</h2>
          <p className="text-gray-600">Manage customer orders</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
