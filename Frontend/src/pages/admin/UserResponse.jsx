import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  MessageCircle, 
  Trash2, 
  Eye, 
  Send,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { showToast } from '../../components/Toast/CustomToast';
import { 
  getAllContacts, 
  getContactById, 
  replyToContact, 
  updateContactStatus,
  deleteContact 
} from '../../services/contactApi';

const UserResponse = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    closed: 0,
    unread: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [viewModal, setViewModal] = useState({ isOpen: false, contact: null });
  const [replyModal, setReplyModal] = useState({ isOpen: false, contact: null, message: '', isReplying: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, contact: null, isDeleting: false });

  useEffect(() => {
    loadContacts();
  }, [statusFilter]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await getAllContacts(params);
      setContacts(response.contacts);
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading contacts:', error);
      showToast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadContacts();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openViewModal = async (contact) => {
    try {
      const response = await getContactById(contact.id);
      setViewModal({ isOpen: true, contact: response.contact });
    } catch (error) {
      console.error('Error fetching contact:', error);
      showToast.error('Failed to load message details');
    }
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, contact: null });
  };

  const openReplyModal = (contact) => {
    setReplyModal({ isOpen: true, contact, message: '', isReplying: false });
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, contact: null, message: '', isReplying: false });
  };

  const handleReply = async () => {
    if (!replyModal.message.trim()) {
      showToast.error('Please enter a reply message');
      return;
    }

    try {
      setReplyModal(prev => ({ ...prev, isReplying: true }));
      await replyToContact(replyModal.contact.id, replyModal.message);
      showToast.success('Reply sent successfully! Email notification sent to user.');
      closeReplyModal();
      loadContacts();
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast.error(error.message || 'Failed to send reply');
    } finally {
      setReplyModal(prev => ({ ...prev, isReplying: false }));
    }
  };

  const openDeleteModal = (contact) => {
    setDeleteModal({ isOpen: true, contact, isDeleting: false });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, contact: null, isDeleting: false });
  };

  const handleDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isDeleting: true }));
      await deleteContact(deleteModal.contact.id);
      showToast.success('Message deleted successfully');
      closeDeleteModal();
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast.error(error.message || 'Failed to delete message');
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'replied':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'closed':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default:
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Messages</h1>
          <p className="text-[#598392]/80">
            View and respond to messages from contact form
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">{stats.total}</span>
            </div>
            <p className="text-blue-400/80 text-sm font-medium">Total Messages</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
            </div>
            <p className="text-yellow-400/80 text-sm font-medium">Pending</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{stats.replied}</span>
            </div>
            <p className="text-green-400/80 text-sm font-medium">Replied</p>
          </div>

          <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-xl border border-gray-500/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-400">{stats.closed}</span>
            </div>
            <p className="text-gray-400/80 text-sm font-medium">Closed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{stats.unread}</span>
            </div>
            <p className="text-purple-400/80 text-sm font-medium">Unread</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#598392]/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-[#598392]/50"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#598392]/50 [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-[#598392] to-[#124559] text-white rounded-xl font-medium hover:from-[#124559] hover:to-[#598392] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#598392]"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-12 text-center">
            <Mail className="w-16 h-16 text-[#598392]/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No messages found</h3>
            <p className="text-[#598392]/60">
              {searchTerm ? 'Try adjusting your search criteria' : 'No contact messages yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`bg-[#01161e]/50 backdrop-blur-xl border border-[#598392]/20 rounded-2xl p-6 hover:border-[#598392]/40 transition-all duration-200 ${
                  !contact.isRead ? 'ring-2 ring-purple-500/20' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#598392] to-[#124559] flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold text-lg">{contact.name}</h3>
                          {!contact.isRead && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[#598392]/80 text-sm mb-2">{contact.email}</p>
                        <p className="text-white font-medium mb-2">{contact.subject}</p>
                        <p className="text-[#598392]/70 text-sm line-clamp-2">
                          {contact.message}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-[#598392]/60 text-xs">
                            {new Date(contact.createdAt).toLocaleString()}
                          </span>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {getStatusIcon(contact.status)}
                            <span className="capitalize">{contact.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <button
                      onClick={() => openViewModal(contact)}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    
                    {contact.status !== 'replied' && (
                      <button
                        onClick={() => openReplyModal(contact)}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                        title="Reply"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => openDeleteModal(contact)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Show reply if exists */}
                {contact.replyMessage && (
                  <div className="mt-4 pt-4 border-t border-[#598392]/20">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-green-400 font-medium text-sm mb-1">Admin Reply:</p>
                          <p className="text-white text-sm whitespace-pre-wrap">{contact.replyMessage}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[#598392]/70">
                            <span>Replied by: {contact.repliedByUser?.name || 'Admin'}</span>
                            <span>{new Date(contact.repliedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewModal.isOpen && viewModal.contact && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#01161e] border-b border-[#598392]/20 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Message Details</h2>
                <button
                  onClick={closeViewModal}
                  className="text-[#598392] hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div className="bg-[#598392]/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Sender Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#598392]/80">Name:</span>
                      <span className="text-white font-medium">{viewModal.contact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#598392]/80">Email:</span>
                      <span className="text-white font-medium">{viewModal.contact.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#598392]/80">Date:</span>
                      <span className="text-white font-medium">
                        {new Date(viewModal.contact.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#598392]/80">Status:</span>
                      <span className={`px-2 py-1 rounded-lg border text-xs font-medium capitalize ${getStatusColor(viewModal.contact.status)}`}>
                        {viewModal.contact.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Subject</h3>
                  <p className="text-white bg-[#598392]/10 rounded-lg p-4">
                    {viewModal.contact.subject}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-white font-semibold mb-2">Message</h3>
                  <p className="text-white bg-[#598392]/10 rounded-lg p-4 whitespace-pre-wrap">
                    {viewModal.contact.message}
                  </p>
                </div>

                {/* Reply if exists */}
                {viewModal.contact.replyMessage && viewModal.contact.replyMessage && (
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">Admin Reply</h3>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-white whitespace-pre-wrap mb-3">
                        {viewModal.contact.replyMessage}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#598392]/70">
                        <span>Replied by: {viewModal.contact.repliedByUser?.name || 'Admin'}</span>
                        <span>{new Date(viewModal.contact.repliedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#598392]/20">
                  {viewModal.contact.status !== 'replied' && (
                    <button
                      onClick={() => {
                        closeViewModal();
                        openReplyModal(viewModal.contact);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Reply to Message
                    </button>
                  )}
                  <button
                    onClick={closeViewModal}
                    className="px-6 py-3 border border-[#598392]/30 text-[#598392] rounded-xl font-medium hover:bg-[#598392]/10 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {replyModal.isOpen && replyModal.contact && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#01161e] border border-[#598392]/20 rounded-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Reply to Message</h2>
                    <p className="text-white/80 text-sm">User will receive your reply via email</p>
                  </div>
                </div>
                <button
                  onClick={closeReplyModal}
                  className="text-white hover:text-white/80 transition-colors"
                  disabled={replyModal.isReplying}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Original Message */}
                <div className="bg-[#598392]/10 rounded-xl p-4">
                  <p className="text-[#598392]/80 text-sm mb-1">Original Message from:</p>
                  <p className="text-white font-semibold mb-2">{replyModal.contact.name} ({replyModal.contact.email})</p>
                  <p className="text-white text-sm"><strong>Subject:</strong> {replyModal.contact.subject}</p>
                  <p className="text-[#598392]/70 text-sm mt-2 line-clamp-3">{replyModal.contact.message}</p>
                </div>

                {/* Reply Input */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Your Reply *
                  </label>
                  <textarea
                    value={replyModal.message}
                    onChange={(e) => setReplyModal(prev => ({ ...prev, message: e.target.value }))}
                    rows="8"
                    className="w-full px-4 py-3 bg-[#598392]/10 border border-[#598392]/30 rounded-xl text-white placeholder-[#598392]/60 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 resize-none"
                    placeholder="Type your reply here... This will be sent to the user via email."
                    disabled={replyModal.isReplying}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReply}
                    disabled={replyModal.isReplying || !replyModal.message.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {replyModal.isReplying ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Reply...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Reply & Notify User
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeReplyModal}
                    disabled={replyModal.isReplying}
                    className="px-6 py-3 border border-[#598392]/30 text-[#598392] rounded-xl font-medium hover:bg-[#598392]/10 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && deleteModal.contact && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#01161e] border border-red-500/20 rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-2">Delete Message</h2>
                <p className="text-[#598392]/80 text-center mb-6">
                  Are you sure you want to delete this message from <span className="text-white font-semibold">{deleteModal.contact.name}</span>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={closeDeleteModal}
                    disabled={deleteModal.isDeleting}
                    className="flex-1 px-6 py-3 border border-[#598392]/30 text-[#598392] rounded-xl font-medium hover:bg-[#598392]/10 transition-all duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteModal.isDeleting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteModal.isDeleting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Delete Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserResponse;
