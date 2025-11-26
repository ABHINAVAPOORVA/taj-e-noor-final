import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Bed, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Sparkles,
  RefreshCw,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface DashboardStats {
  totalGuests: number;
  activeBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  availableRooms: number;
  totalRooms: number;
}

interface ServiceStats {
  name: string;
  count: number;
  revenue: number;
}

interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];

export function OverviewDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuests: 0,
    activeBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    availableRooms: 0,
    totalRooms: 4,
  });
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setServiceStats(data.serviceStats);
        setBookingTrends(data.bookingTrends);
        setLastUpdated(new Date());
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      toast.error("Error loading dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
    trend?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 bg-gradient-to-br ${color} border-0 shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-sm mb-2">{title}</p>
            <p className="text-white text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-white/70 text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                {trend}
              </p>
            )}
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Icon className="text-white" size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">
            Real-time analytics and insights • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button
          onClick={fetchDashboardData}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Guests"
          value={stats.totalGuests}
          icon={Users}
          color="from-purple-500 to-purple-700"
          trend="+12% from last week"
        />
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings}
          icon={Calendar}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-green-500 to-green-700"
          trend="+8% from last month"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={Bed}
          color="from-orange-500 to-orange-700"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Usage Chart */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-purple-600" size={24} />
            <h3 className="text-xl font-semibold">Popular Services</h3>
          </div>
          {serviceStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No service data available
            </div>
          )}
        </Card>

        {/* Service Revenue Distribution */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="text-green-600" size={24} />
            <h3 className="text-xl font-semibold">Service Revenue Distribution</h3>
          </div>
          {serviceStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {serviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </Card>
      </div>

      {/* Booking Trends Chart */}
      <Card className="p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-blue-600" size={24} />
          <h3 className="text-xl font-semibold">Booking & Revenue Trends</h3>
        </div>
        {bookingTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="bookings" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            No trend data available
          </div>
        )}
      </Card>

      {/* Room Status */}
      <Card className="p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Bed className="text-indigo-600" size={24} />
          <h3 className="text-xl font-semibold">Room Availability</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <p className="text-green-600 text-sm mb-2">Available Rooms</p>
            <p className="text-green-700 text-4xl font-bold">{stats.availableRooms}</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <p className="text-blue-600 text-sm mb-2">Occupied Rooms</p>
            <p className="text-blue-700 text-4xl font-bold">{stats.totalRooms - stats.availableRooms}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Occupancy</span>
            <span className="font-semibold text-gray-900">{stats.occupancyRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.occupancyRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}