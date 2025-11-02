import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Droplet,
  Home,
  IdCard,
  X,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import {
  getAllApplications,
  approveApplication,
  rejectApplication,
  deleteApplication,
} from '../../services/adminApi';
import { showToast } from '../../components/Toast/CustomToast';
import LCFront from './LC-Front';

const ReviewCardApplication = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewModal, setViewModal] = useState({ isOpen: false, application: null });
  const [cardPreviewModal, setCardPreviewModal] = useState({ isOpen: false, application: null });
  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    application: null,
    isApproving: false,
  });
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    application: null,
    rejectionReason: '',
    isSubmitting: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    application: null,
    isDeleting: false,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchQuery, filterStatus, applications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllApplications();
      setApplications(response.applications);
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showToast.error(error.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.studentID?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }

    setFilteredApplications(filtered);
  };

  const openApproveModal = (application) => {
    setApproveModal({
      isOpen: true,
      application,
      isApproving: false,
    });
  };

  const closeApproveModal = () => {
    setApproveModal({
      isOpen: false,
      application: null,
      isApproving: false,
    });
  };

  const handleApprove = async () => {
    if (!approveModal.application) return;

    try {
      setApproveModal((prev) => ({ ...prev, isApproving: true }));
      
      await approveApplication(approveModal.application._id);
      
      showToast.success(`Application approved for ${approveModal.application.name}`);
      
      closeApproveModal();
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Error approving application:', error);
      showToast.error(error.message || 'Failed to approve application');
      setApproveModal((prev) => ({ ...prev, isApproving: false }));
    }
  };

  const openRejectModal = (application) => {
    setRejectModal({
      isOpen: true,
      application,
      rejectionReason: '',
      isSubmitting: false,
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      isOpen: false,
      application: null,
      rejectionReason: '',
      isSubmitting: false,
    });
  };

  const handleReject = async () => {
    if (!rejectModal.rejectionReason.trim()) {
      showToast.error('Please provide a rejection reason');
      return;
    }

    try {
      setRejectModal((prev) => ({ ...prev, isSubmitting: true }));
      await rejectApplication(
        rejectModal.application._id,
        rejectModal.rejectionReason
      );
      showToast.success(`Application rejected for ${rejectModal.application.name}`);
      closeRejectModal();
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      showToast.error(error.message || 'Failed to reject application');
      setRejectModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const openDeleteModal = (application) => {
    setDeleteModal({
      isOpen: true,
      application,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      application: null,
      isDeleting: false,
    });
  };

  const handleDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await deleteApplication(deleteModal.application._id);
      showToast.success(`Application deleted for ${deleteModal.application.name}`);
      closeDeleteModal();
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      showToast.error(error.message || 'Failed to delete application');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const openViewModal = (application) => {
    setViewModal({ isOpen: true, application });
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, application: null });
  };

  const openCardPreviewModal = (application) => {
    setCardPreviewModal({ isOpen: true, application });
  };

  const closeCardPreviewModal = () => {
    setCardPreviewModal({ isOpen: false, application: null });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: <Clock className="w-3 h-3 mr-1" />,
        class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        text: 'Pending',
      },
      approved: {
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        class: 'bg-green-500/20 text-green-400 border-green-500/20',
        text: 'Approved',
      },
      rejected: {
        icon: <XCircle className="w-3 h-3 mr-1" />,
        class: 'bg-red-500/20 text-red-400 border-red-500/20',
        text: 'Rejected',
      },
    };

    const badge = badges[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.class}`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Review Card Applications
        </h1>
        <p className="text-[#598392]/80">
          Approve, reject, or manage library card applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#598392]/70 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
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

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-[#598392]/10 border border-[#598392]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 [&>option]:text-gray-900 [&>option]:bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#598392]"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-[#598392]/40 mx-auto mb-4" />
            <p className="text-[#598392]/70 text-lg">No applications found</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application._id}
              className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-xl p-6 hover:border-[#598392]/40 transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <img
                    src={application.profilePicture}
                    alt={application.name}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-[#598392]/30"
                  />
                </div>

                {/* Application Details */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {application.name}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <button
                      onClick={() => openViewModal(application)}
                      className="px-3 py-1.5 bg-[#598392]/20 text-[#598392] rounded-lg hover:bg-[#598392]/30 transition-all duration-200 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-[#598392]/80">
                      <Mail className="w-4 h-4 mr-2" />
                      {application.email}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <IdCard className="w-4 h-4 mr-2" />
                      {application.studentID}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {application.department || 'N/A'}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <Phone className="w-4 h-4 mr-2" />
                      {application.phoneNumber}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <Home className="w-4 h-4 mr-2" />
                      {application.hallName}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <MapPin className="w-4 h-4 mr-2" />
                      {application.district}
                    </div>
                    <div className="flex items-center text-[#598392]/80">
                      <Droplet className="w-4 h-4 mr-2" />
                      {application.bloodGroup}
                    </div>
                  </div>

                  <div className="flex items-center text-[#598392]/70 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Applied: {new Date(application.appliedAt).toLocaleDateString()}
                    {application.reviewedAt && (
                      <span className="ml-4">
                        Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 flex-wrap">
                    <button
                      onClick={() => openCardPreviewModal(application)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center border border-blue-500/20"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Preview Card
                    </button>
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openApproveModal(application)}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 flex items-center border border-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(application)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center border border-red-500/20"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openDeleteModal(application)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {viewModal.isOpen && viewModal.application && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Application Details</h3>
              <button
                onClick={closeViewModal}
                className="text-[#598392]/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#598392]/70 text-sm mb-2">Profile Picture</p>
                  <img
                    src={viewModal.application.profilePicture}
                    alt="Profile"
                    className="w-full h-48 object-cover rounded-lg border-2 border-[#598392]/30"
                  />
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm mb-2">Signature</p>
                  <img
                    src={viewModal.application.signature}
                    alt="Signature"
                    className="w-full h-48 object-contain rounded-lg border-2 border-[#598392]/30 bg-white"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[#598392]/70 text-sm">Name</p>
                  <p className="text-white font-medium">{viewModal.application.name}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Email</p>
                  <p className="text-white font-medium">{viewModal.application.email}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Student ID</p>
                  <p className="text-white font-medium">{viewModal.application.studentID}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Department</p>
                  <p className="text-white font-medium">{viewModal.application.department || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Phone Number</p>
                  <p className="text-white font-medium">{viewModal.application.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Emergency Phone</p>
                  <p className="text-white font-medium">
                    {viewModal.application.emergencyPhoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Hall Name</p>
                  <p className="text-white font-medium">{viewModal.application.hallName}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">District</p>
                  <p className="text-white font-medium">{viewModal.application.district}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Blood Group</p>
                  <p className="text-white font-medium">{viewModal.application.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Status</p>
                  <div className="mt-1">{getStatusBadge(viewModal.application.status)}</div>
                </div>
                <div>
                  <p className="text-[#598392]/70 text-sm">Applied At</p>
                  <p className="text-white font-medium">
                    {new Date(viewModal.application.appliedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {viewModal.application.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 font-medium mb-1">Rejection Reason:</p>
                  <p className="text-red-400/80">{viewModal.application.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Approve Application
            </h3>

            <p className="text-[#598392]/80 text-center mb-6">
              Are you sure you want to approve{' '}
              <span className="text-white font-medium">{approveModal.application?.name}</span>'s
              library card application? The applicant will receive an approval email with further instructions.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeApproveModal}
                disabled={approveModal.isApproving}
                className="flex-1 px-4 py-2 bg-[#598392]/10 text-[#598392] rounded-lg hover:bg-[#598392]/20 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approveModal.isApproving}
                className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 font-medium border border-green-500/20 disabled:opacity-50 flex items-center justify-center"
              >
                {approveModal.isApproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400 mr-2"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Reject Application
            </h3>

            <p className="text-[#598392]/80 text-center mb-6">
              Please provide a reason for rejecting{' '}
              <span className="text-white font-medium">{rejectModal.application?.name}</span>'s
              application. This will be sent via email.
            </p>

            <textarea
              value={rejectModal.rejectionReason}
              onChange={(e) =>
                setRejectModal((prev) => ({
                  ...prev,
                  rejectionReason: e.target.value,
                }))
              }
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-lg text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50 mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={closeRejectModal}
                disabled={rejectModal.isSubmitting}
                className="flex-1 px-4 py-2 bg-[#598392]/10 text-[#598392] rounded-lg hover:bg-[#598392]/20 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectModal.isSubmitting}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 font-medium border border-red-500/20 disabled:opacity-50 flex items-center justify-center"
              >
                {rejectModal.isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400 mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject & Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Delete Application
            </h3>

            <p className="text-[#598392]/80 text-center mb-6">
              Are you sure you want to delete{' '}
              <span className="text-white font-medium">{deleteModal.application?.name}</span>'s
              application? This action cannot be undone.
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
                onClick={handleDelete}
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
                    Delete Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Preview Modal */}
      {cardPreviewModal.isOpen && cardPreviewModal.application && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            {/* Close Button */}
            <button
              onClick={closeCardPreviewModal}
              className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full p-2 transition-all duration-200 border border-red-500/20 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-6">Library Card Preview</h3>

            {/* Library Card */}
            <div className="flex justify-center">
              <LCFront 
                applicationData={cardPreviewModal.application}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCardApplication;
