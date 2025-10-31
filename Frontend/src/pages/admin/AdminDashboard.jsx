import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  XCircle,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, showing placeholder data
    setTimeout(() => {
      setStats({
        totalUsers: 150,
        totalApplications: 45,
        pendingApplications: 12,
        approvedApplications: 28,
        rejectedApplications: 5
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: <FileText className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400'
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: <XCircle className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400'
    }
  ];

  const approvalRate = stats.totalApplications > 0 
    ? ((stats.approvedApplications / stats.totalApplications) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-[#598392]/80">
          Welcome back! Here's what's happening with your library card system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`
              ${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} 
              rounded-2xl p-6 transition-all duration-200 hover:scale-105
              hover:shadow-lg hover:shadow-${stat.color.split('-')[1]}-500/10
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-[#598392]/70 text-sm font-medium mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {isLoading ? (
                  <span className="animate-pulse">-</span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Approval Rate</h3>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-bold text-green-400">{approvalRate}%</span>
              <span className="text-[#598392]/70 text-sm mb-2">approval rate</span>
            </div>
            <div className="w-full bg-[#598392]/20 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>
            <p className="text-[#598392]/70 text-sm">
              {stats.approvedApplications} out of {stats.totalApplications} applications approved
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-[#598392]/10 hover:bg-[#598392]/20 border border-[#598392]/20 rounded-xl transition-all duration-200 text-left">
              <span className="text-white font-medium">Review Pending Applications</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">
                {stats.pendingApplications}
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-[#598392]/10 hover:bg-[#598392]/20 border border-[#598392]/20 rounded-xl transition-all duration-200 text-left">
              <span className="text-white font-medium">View All Users</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold">
                {stats.totalUsers}
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#598392] to-[#124559] hover:from-[#124559] hover:to-[#598392] rounded-xl transition-all duration-200 text-left">
              <span className="text-white font-medium">Add New Admin</span>
              <TrendingUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="flex items-center justify-between p-4 bg-[#598392]/5 hover:bg-[#598392]/10 border border-[#598392]/10 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#598392] to-[#124559] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">New application submitted</p>
                  <p className="text-[#598392]/70 text-sm">Student ID: 2021-XXXX</p>
                </div>
              </div>
              <span className="text-[#598392]/70 text-sm">2 hours ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
