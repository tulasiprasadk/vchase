import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { toast } from "react-hot-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  FileText,
  Download,
  RefreshCw,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  category: string;
  message: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  details?: string;
}

const SystemLogs: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API calls
      const mockLogs: LogEntry[] = [
        {
          id: "1",
          timestamp: "2024-01-15 14:30:25",
          level: "info",
          category: "Authentication",
          message: "User login successful",
          userId: "user123",
          userEmail: "john.doe@example.com",
          ipAddress: "192.168.1.100",
        },
        {
          id: "2",
          timestamp: "2024-01-15 14:28:12",
          level: "warning",
          category: "Security",
          message: "Multiple failed login attempts detected",
          ipAddress: "192.168.1.200",
          details: "5 failed attempts in 10 minutes",
        },
        {
          id: "3",
          timestamp: "2024-01-15 14:25:45",
          level: "error",
          category: "Database",
          message: "Connection timeout to database server",
          details: "Timeout after 30 seconds, retrying connection",
        },
        {
          id: "4",
          timestamp: "2024-01-15 14:20:33",
          level: "success",
          category: "System",
          message: "Database backup completed successfully",
          details: "Backup size: 2.4GB, Duration: 5 minutes",
        },
        {
          id: "5",
          timestamp: "2024-01-15 14:15:18",
          level: "info",
          category: "User Management",
          message: "New user registration",
          userId: "user456",
          userEmail: "jane.smith@example.com",
          ipAddress: "192.168.1.150",
        },
        {
          id: "6",
          timestamp: "2024-01-15 14:10:07",
          level: "warning",
          category: "Performance",
          message: "High CPU usage detected",
          details: "CPU usage: 85% for 5 minutes",
        },
        {
          id: "7",
          timestamp: "2024-01-15 14:05:42",
          level: "error",
          category: "API",
          message: "Rate limit exceeded for API endpoint",
          ipAddress: "192.168.1.300",
          details: "Endpoint: /api/events, Limit: 100 requests/minute",
        },
        {
          id: "8",
          timestamp: "2024-01-15 14:00:15",
          level: "info",
          category: "Event Management",
          message: "New event created",
          userId: "user789",
          userEmail: "organizer@example.com",
          details: "Event: Tech Conference 2024",
        },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load system logs");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterLogs = useCallback(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((log) => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const handleExportLogs = () => {
    const csvContent = [
      ["Timestamp", "Level", "Category", "Message", "User Email", "IP Address", "Details"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.userEmail || "",
        log.ipAddress || "",
        log.details || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Logs exported successfully");
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const categories = Array.from(new Set(logs.map((log) => log.category)));

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true} allowedRoles={["super_admin"]}>
        <DashboardLayout title="System Logs">
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
        <title>System Logs - Super Admin</title>
        <meta
          name="description"
          content="System logs and audit trail for super administrators"
        />
      </Head>

      <DashboardLayout title="System Logs">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-6 text-white">
            <div className="flex items-center mb-2">
              <FileText className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold">System Logs</h1>
            </div>
            <p className="opacity-90">
              Monitor system activity, track user actions, and review audit trails.
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Level Filter */}
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="success">Success</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={fetchLogs}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
                <button
                  onClick={handleExportLogs}
                  className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                System Activity ({filteredLogs.length} entries)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          {log.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getLevelIcon(log.level)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(
                              log.level
                            )}`}
                          >
                            {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{log.message}</div>
                          {log.details && (
                            <div className="text-xs text-gray-500 mt-1">{log.details}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.userEmail || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default SystemLogs;