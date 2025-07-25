import { useEffect, useState } from 'react';
import { Download, Receipt, Calendar, User, Mail, Phone, BookOpen, GraduationCap, Building, CreditCard } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function MyPayments() {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };

  useEffect(() => {
    const payments = {
      userId: auth.vendorid
    };
    fetch("http://localhost:4000/multivendor/getpayments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(payments)
    })
      .then((res) => res.json())
      .then((result) => {
        setPayment(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
        setLoading(false);
      });
  }, [auth.vendorid]);

  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const generateInvoice = (item) => {
  const doc = new jsPDF();

  // Add logo at top-left
  const logoPath = '/img/logos/logo-inner.png'; // Make sure this is a valid public path
  const image = new Image();
  image.src = logoPath;
  image.onload = () => {
    doc.addImage(image, 'PNG', 14, 10, 30, 18); // x, y, width, height

    // Header text beside logo
    doc.setFontSize(22);
    doc.setTextColor('#1f2937');
    doc.text('INVOICE', 105, 20, { align: 'center' });

    // Invoice info
    doc.setFontSize(11);
    doc.setTextColor('#6b7280');
    doc.text(`Invoice ID: ${item.paymentId}`, 14, 34);
    doc.text(`Date: ${new Date(item.date).toLocaleDateString('en-GB')}`, 14, 40);

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 44, 196, 44);

    // Invoice Table
    autoTable(doc, {
      startY: 50,
      head: [['Description', 'Details']],
      body: [
        ['Student Name', item.user_id?.name || 'N/A'],
        ['Email', item.user_id?.email || auth?.email || 'N/A'],
        ['Phone', item.user_id?.phone || 'N/A'],
        ['Course', item.course_id?.title || 'N/A'],
        ['Instructor', item.instructorid?.name || 'N/A'],
        ['Vendor', item.venid?.name || 'N/A'],
        ['Amount Paid', `Rs. ${item.amount.toLocaleString('en-IN')}`]
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 11,
        halign: 'left'
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        textColor: [31, 41, 55],
        lineColor: [229, 231, 235],
        lineWidth: 0.1,
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });

    // Status + Thank You
    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFillColor(34, 197, 94); // green
    doc.roundedRect(14, finalY, 35, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', 26, finalY + 7, { align: 'center' });

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your payment!', 14, finalY + 20);

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(14, finalY + 25, 196, finalY + 25);
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, finalY + 32);

    // Save
    doc.save(`Invoice_${item.paymentId}.pdf`);
  };

  image.onerror = () => {
    console.error('Logo not found, generating invoice without logo.');
    doc.text('INVOICE', 105, 20, { align: 'center' });
    doc.save(`Invoice_${item.paymentId}.pdf`);
  };
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (date) => {
    const daysDiff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return 'bg-green-100 text-green-800';
    if (daysDiff <= 30) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (date) => {
    const daysDiff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return 'Recent';
    if (daysDiff <= 30) return 'This Month';
    return 'Older';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment History</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track and manage all your course payments and bookings in one place
          </p>
        </div>
        <div>
            <button className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl' style={{marginLeft:"-1060px"}} onClick={handleBack}>back</button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payment.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.reduce((sum, item) => sum + item.amount, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Recent Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payment.filter(item => {
                    const daysDiff = Math.floor((new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24));
                    return daysDiff <= 7;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment List */}
        {payment.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Your payment history will appear here once you make your first booking.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payment.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{item.course_id?.title}</h3>
                        <p className="text-gray-600">Payment ID: {item.paymentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.date)}`}>
                        {getStatusText(item.date)}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Student</p>
                        <p className="text-gray-900">{item.user_id?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="text-gray-900">{auth.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="text-gray-900">{item.user_id?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Instructor</p>
                        <p className="text-gray-900">{item.instructorid?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vendor</p>
                        <p className="text-gray-900">{item.venid?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Payment Successful</span>
                    </div>
                    <button
                      onClick={() => generateInvoice(item)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPayments;