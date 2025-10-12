import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [recentCards] = useState([
    {
      id: 1,
      name: 'Student Library Card',
      createdAt: '2025-10-10',
      status: 'Active',
      type: 'Student'
    },
    {
      id: 2,
      name: 'Faculty Access Card',
      createdAt: '2025-10-08',
      status: 'Pending',
      type: 'Faculty'
    },
    {
      id: 3,
      name: 'Visitor Pass',
      createdAt: '2025-10-05',
      status: 'Expired',
      type: 'Visitor'
    }
  ]);

  const stats = [
    {
      title: 'Total Cards',
      value: '12',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      color: 'from-[#598392] to-[#124559]',
      bgColor: 'bg-[#598392]/10'
    },
    {
      title: 'Active Cards',
      value: '8',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Pending Approval',
      value: '3',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-400/10'
    },
    {
      title: 'Templates Used',
      value: '5',
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4m-6-6V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h4a2 2 0 012 2v2m0 0v4a2 2 0 01-2 2h-2m0 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-400/10'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-400 bg-green-400/10';
      case 'Pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Expired':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const quickActions = [
    {
      title: 'Generate New Card',
      description: 'Create a new library card with custom template',
      icon: 'M12 4v16m8-8H4',
      color: 'from-[#598392] to-[#124559]',
      link: '/generate'
    },
    {
      title: 'Browse Templates',
      description: 'Explore our collection of card templates',
      icon: 'M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z',
      color: 'from-blue-500 to-blue-700',
      link: '/templates'
    },
    {
      title: 'My Profile',
      description: 'Update your personal information',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'from-purple-500 to-purple-700',
      link: '/profile'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#01161e] via-[#124559] to-[#598392] opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Welcome to your
              <span className="block bg-gradient-to-r from-[#598392] to-white bg-clip-text text-transparent">
                AutoCard Dashboard
              </span>
            </h1>
            <p className="text-xl text-[#598392]/80 max-w-3xl mx-auto leading-relaxed">
              Manage your library cards, track applications, and generate new cards with ease. 
              Your digital library management hub.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#01161e]/50 backdrop-blur-sm border border-[#598392]/20 rounded-xl p-6 hover:border-[#598392]/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-[#01161e]/50 backdrop-blur-sm border border-[#598392]/20 rounded-xl p-6 hover:border-[#598392]/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#598392] transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-[#598392]/70 text-sm leading-relaxed">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Cards */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Cards</h2>
            <Link
              to="/cards"
              className="text-[#598392] hover:text-white transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-[#01161e]/50 backdrop-blur-sm border border-[#598392]/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#598392]/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                      Card Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#598392]/10">
                  {recentCards.map((card) => (
                    <tr key={card.id} className="hover:bg-[#598392]/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{card.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[#598392]/80">{card.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[#598392]/80">{card.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(card.status)}`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-[#598392] hover:text-white transition-colors duration-200">
                            View
                          </button>
                          <button className="text-[#598392] hover:text-white transition-colors duration-200">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;