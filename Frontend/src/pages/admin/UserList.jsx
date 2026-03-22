import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, User, Mail, Phone, Calendar, CheckCircle, XCircle, Search } from 'lucide-react';
import { getAllUsers, deleteUser } from '../../services/adminApi';
import { showToast } from '../../components/Toast/CustomToast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    regularUsers: 0,
    verified: 0,
    unverified: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null,
    isDeleting: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setUsers(response.users);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast.error(error.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.studentID?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const openDeleteModal = (user) => {
    setDeleteModal({
      isOpen: true,
      user,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      user: null,
      isDeleting: false,
    });
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      
      await deleteUser(deleteModal.user.id);
      
      showToast.success(`User ${deleteModal.user.name} deleted successfully`);
      
      // Update users list
      setUsers((prev) => prev.filter((user) => user.id !== deleteModal.user.id));
      
      closeDeleteModal();
      
      // Refresh to update stats
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast.error(error.message || 'Failed to delete user');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/20">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20">
        <User className="w-3 h-3 mr-1" />
        User
      </span>
    );
  };

  const getVerifiedBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" />
        Unverified
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-[#598392]/80">
          Manage all registered users and their accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Regular Users</p>
              <p className="text-2xl font-bold text-blue-400">{stats.regularUsers}</p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Verified</p>
              <p className="text-2xl font-bold text-green-400">{stats.verified}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Unverified</p>
              <p className="text-2xl font-bold text-red-400">{stats.unverified}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#598392]/60" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#598392]/10 border border-[#598392]/30 rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-[#598392]/10 border border-[#598392]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 [&>option]:text-gray-900 [&>option]:bg-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#598392]"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <Users className="w-16 h-16 text-[#598392]/40 mx-auto mb-4" />
            <p className="text-[#598392]/70 text-lg">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#598392]/10 border-b border-[#598392]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#598392] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#598392]/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#598392]/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePicture ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profilePicture}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#598392] to-[#124559] flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#598392]/80">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-1" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {user.studentID || <span className="text-[#598392]/40">N/A</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVerifiedBadge(user.isVerified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#598392]/80 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Delete User
            </h3>
            
            <p className="text-[#598392]/80 text-center mb-6">
              Are you sure you want to delete{' '}
              <span className="text-white font-medium">{deleteModal.user?.name}</span>?
              This action cannot be undone and will permanently remove all user data.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 bg-[#598392]/10 text-[#598392] rounded-lg hover:bg-[#598392]/20 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteModal.isDeleting}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium border border-red-500/20 disabled:opacity-50 flex items-center justify-center"
              >
                {deleteModal.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
