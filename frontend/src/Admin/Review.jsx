import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, X, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch feedbacks function for reuse
  const fetchFeedbacks = () => {
    fetch("http://localhost:4000/multivendor/adminfeedback")
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching feedback:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Use your original localStorage auth
    const storedAuth = JSON.parse(localStorage.getItem('tourstorage'));
    setAuth(storedAuth);
    fetchFeedbacks();
  }, []);

  const handleReplyClick = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText('');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setReplyText('');
  };

  const handleReplySubmit = () => {
    const replydata = {
      reply: replyText,
      auth: auth?.vendorid,
      feedbackId: selectedFeedback?._id
    };
    
    setSubmitting(true);
    
    fetch("http://localhost:4000/multivendor/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(replydata)
    })
      .then(res => res.json())
      .then(() => {
        fetch('http://localhost:4000/multivendor/statusupdate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 1,
            feedbackId: selectedFeedback?._id
          })
        })
        .then(() => {
          alert(`Reply sent for feedback "${selectedFeedback.title}": ${replyText}`);
          handleModalClose();
          setSubmitting(false);
          fetchFeedbacks(); // Refresh feedbacks after reply and status update
        });
      })
      .catch(() => {
        alert("Failed to send reply.");
        setSubmitting(false);
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Feedback Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and respond to customer feedback</p>
            </div>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Found</h3>
            <p className="text-gray-600">There are no feedback submissions to display at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.userId?.name || "Unknown User"}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {item.createdAt ? formatDate(item.createdAt) : 'Recent'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-xl text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    {item.status === 1 ? (
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Replied
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReplyClick(item)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Reply to Feedback</h3>
                  </div>
                  <button
                    onClick={handleModalClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Feedback Details */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{selectedFeedback?.userId?.name || "Unknown User"}</p>
                      <p className="text-sm text-gray-600">Customer</p>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{selectedFeedback?.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedFeedback?.description}</p>
                </div>

                {/* Reply Form */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Your Reply</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 resize-none"
                    rows="6"
                    placeholder="Type your professional reply here..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleModalClose}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || submitting}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackList;