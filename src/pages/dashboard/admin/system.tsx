import React, { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Shield,
  Database,
  Server,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  HardDrive,
  Activity,
} from "lucide-react";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  systemHealth: "healthy" | "warning" | "critical";
  databaseSize: string;
  serverUptime: string;
  apiResponseTime: string;
  activeConnections: number;
}

const SystemManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    systemHealth: "healthy",
    databaseSize: "0 MB",
    serverUptime: "0 days",
    apiResponseTime: "0ms",
    activeConnections: 0,
  });

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      setSystemStats({
        totalUsers: 1247,
        activeUsers: 342,
        totalEvents: 89,
        systemHealth: "healthy",
        databaseSize: "2.4 GB",
        serverUptime: "15 days",
        apiResponseTime: "85ms",
        activeConnections: 156,
      });
    } catch {
      toast.error("Failed to load system statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemAction = async (action: string) => {
    try {
      toast.loading(`Executing ${action}...`);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.dismiss();
      toast.success(`${action} completed successfully`);
      
      // Refresh stats after action
      fetchSystemStats();
    } catch {
      toast.dismiss();
      toast.error(`Failed to execute ${action}`);
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["super_admin"]}>
        <DashboardLayout title="System Management">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["super_admin"]}>
      <Head>
        <title>System Management - Super Admin</title>
        <meta
          name="description"
          content="System management and monitoring for super administrators"
        />
      </Head>

      <DashboardLayout title="System Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <Shield className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">System Management</h1>
            </div>
            <p className="opacity-90">
              Monitor system health, manage infrastructure, and maintain platform stability.
            </p>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <div className="flex items-center mt-2">
                    {getHealthIcon(systemStats.systemHealth)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getHealthColor(systemStats.systemHealth)}`}>
                      {systemStats.systemHealth.charAt(0).toUpperCase() + systemStats.systemHealth.slice(1)}
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {systemStats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {systemStats.totalUsers.toLocaleString()} total
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Database Size</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {systemStats.databaseSize}
                  </p>
                  <p className="text-xs text-gray-500">
                    {systemStats.activeConnections} active connections
                  </p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Server Uptime</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {systemStats.serverUptime}
                  </p>
                  <p className="text-xs text-gray-500">
                    API: {systemStats.apiResponseTime}
                  </p>
                </div>
                <Server className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Actions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Perform system maintenance and administrative tasks
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSystemAction("Cache Clear")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </button>

                <button
                  onClick={() => handleSystemAction("Database Backup")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  Backup Database
                </button>

                <button
                  onClick={() => handleSystemAction("System Optimization")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Optimize System
                </button>

                <button
                  onClick={() => handleSystemAction("Security Scan")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </button>

                <button
                  onClick={() => handleSystemAction("Performance Analysis")}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Analyze Performance
                </button>

                <button
                  onClick={() => handleSystemAction("System Restart")}
                  className="flex items-center justify-center px-4 py-3 border border-red-300 rounded-md shadow-sm bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Restart System
                </button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Platform Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Users:</span>
                      <span className="font-medium">{systemStats.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Users:</span>
                      <span className="font-medium">{systemStats.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Events:</span>
                      <span className="font-medium">{systemStats.totalEvents.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">System Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">API Response Time:</span>
                      <span className="font-medium">{systemStats.apiResponseTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Database Size:</span>
                      <span className="font-medium">{systemStats.databaseSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Server Uptime:</span>
                      <span className="font-medium">{systemStats.serverUptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SystemManagement;
