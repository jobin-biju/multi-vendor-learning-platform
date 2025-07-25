import { useEffect, useState } from 'react';
import { MessageCircle, Send, X, Clock, CheckCircle, User, Calendar, Star } from 'lucide-react';

function ViewReviewIns() {
  const [viewreplyins, setViewreplyins] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const auth = JSON.parse(localStorage.getItem('tourstorage'));

  useEffect(() => {
    const data = {
      userId: auth.vendorid,
    };
    fetch('http://localhost:4000/multivendor/viewreviewins', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        setViewreplyins(result);
      });
  }, []);

  const vendorFeedbacks = viewreplyins.filter((item) => item.type === 'vendor');

  const handleReplyChange = (id, value) => {
    setReplyTexts((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (item) => {
    const replydata = {
      reply: replyTexts[item._id] || '',
      auth: auth?._id,
      feedbackId: item._id,
    };

    fetch('http://localhost:4000/multivendor/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replydata),
    })
      .then((res) => res.json())
      .then(() => {
        fetch('http://localhost:4000/multivendor/statusupdate', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedbackId: item._id,
            status: 1,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            setViewreplyins((prev) =>
              prev.map((fb) => (fb._id === item._id ? { ...fb, status: 1 } : fb))
            );
            setActiveReplyId(null);
            setReplyTexts((prev) => ({ ...prev, [item._id]: '' }));
          });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 uppercase tracking-wider">
              Vendor Feedbacks
            </h2>
          </div>

          {/* Reviews */}
          {vendorFeedbacks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-xl text-gray-600">No vendor feedback found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {vendorFeedbacks.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.02] transform"
                >
                  <div className="p-8">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900 mb-1">
                            <strong>User:</strong> <span className="text-blue-700">{item.userId?.name || 'Unknown'}</span>
                          </p>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <strong>Submitted At:</strong>{' '}
                            {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <strong className="text-gray-700">Status:</strong>
                        {item.status === 1 ? (
                          <span className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            <span>Replied</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            <Clock className="w-4 h-4" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-6">
                      <p className="text-lg leading-relaxed mb-4">
                        <strong>Description:</strong> {item.description}
                      </p>
                    </div>

                    {/* Action Section */}
                    {item.status !== 1 && (
                      <div className="space-y-4">
                        <button
                          onClick={() => setActiveReplyId(item._id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Reply</span>
                        </button>

                        {activeReplyId === item._id && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex flex-wrap items-center gap-4">
                              <input
                                type="text"
                                placeholder="Type your reply..."
                                value={replyTexts[item._id] || ''}
                                onChange={(e) => handleReplyChange(item._id, e.target.value)}
                                className="flex-grow min-w-0 p-4 border-2 border-blue-300 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-700"
                              />

                              <button
                                onClick={() => handleReplySubmit(item)}
                                disabled={!(replyTexts[item._id] && replyTexts[item._id].trim())}
                                className={`px-8 py-3 rounded-full font-bold transition-all duration-200 flex items-center space-x-2 ${
                                  replyTexts[item._id] && replyTexts[item._id].trim()
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-400 text-white cursor-not-allowed'
                                }`}
                              >
                                <Send className="w-5 h-5" />
                                <span>Submit</span>
                              </button>

                              <button
                                onClick={() => setActiveReplyId(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md"
                              >
                                <X className="w-5 h-5" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewReviewIns;