import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, CheckCircle, Download, Award } from 'lucide-react';
import url from '../Vendor/ImageUrl';

function CourseLessons() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const courseid = state?.courseid;
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [downloaded, setDownloaded] = useState(false);
  const [tailwindReady, setTailwindReady] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [auth, useAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')));


  useEffect(() => {
    fetchUserData();
  })


  useEffect(() => {
    const hasDownloaded = localStorage.getItem('certificateDownloaded');
    if (hasDownloaded) {
      setDownloaded(true);
    }
  }, []);


  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/multivendor/userprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: auth.vendorid })
      });
      const data = await response.json();
      setName(data.name);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Helper function to calculate total duration correctly
  const calculateTotalDuration = (lessons) => {
    return lessons.reduce((total, lesson) => {
      const duration = lesson.courseduration;

      if (!duration) return total;

      const parts = duration.split(':').map(part => parseInt(part.trim(), 10));

      if (parts.some(isNaN)) return total;

      let minutes = 0;

      if (parts.length === 3) {
        const [hours, mins, secs] = parts;
        minutes = hours * 60 + mins + secs / 60;
      } else if (parts.length === 2) {
        const [mins, secs] = parts;
        minutes = mins + Math.round(secs / 60);
      } else if (parts.length === 1) {
        minutes = parts[0];
      }

      return total + minutes;
    }, 0);
  };


  useEffect(() => {
    fetch(`http://localhost:4000/multivendor/checkpurchase?userid=${auth.vendorid}&courseid=${courseid}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== 1) {
          alert("You have not purchased this course.");
          navigate(-1);
        }
      });

    fetch(`http://localhost:4000/multivendor/lessons/${courseid}`)
      .then(res => res.json())
      .then(data => {
        setLessons(data || []);
        if (data && data.length > 0) {
          setSelectedLesson(data[0]);
        }
      });
  }, [courseid, auth, navigate]);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);

  };

  const markAsCompleted = async (lessonId, instructorId) => {
    const newCompletedLessons = new Set([...completedLessons, lessonId]);
    setCompletedLessons(newCompletedLessons);
    const completedLessonsArray = Array.from(newCompletedLessons);

    const payload = {
      userId: auth.vendorid,
      courseId: courseid,
      instructorId,
      completedLessons: completedLessonsArray,
      totalLessons: lessons.length,
    };
    console.log('userid', auth._id);
    

    try {
      // Send to backend
      await fetch('http://localhost:4000/multivendor/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error saving completed lessons:', error);
    }

    // Show certificate modal if all lessons are completed
    if (newCompletedLessons.size === lessons.length && lessons.length > 0) {
      setTimeout(() => {
        setShowCertificateModal(true);
      }, 1000);
    }
  };


  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration.includes(':') ? duration : `${duration} min`;
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const section = lesson.sectionview?.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(lesson);
    return acc;
  }, {});

  const isCoursecompleted = () => {
    return lessons.length > 0 && completedLessons.size === lessons.length;
  };

  const generateCertificate = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 850;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner border
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 180);

    // Subtitle
    ctx.font = '32px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('This is to certify that', canvas.width / 2, 250);

    // Student name
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText(name || 'Student Name', canvas.width / 2, 320);

    // Course completion text
    ctx.font = '32px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 390);

    // Course title
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(state?.title || 'Course Title', canvas.width / 2, 460);

    // Date
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = '28px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Completed on ${completionDate}`, canvas.width / 2, 540);

    // Achievement stats
    ctx.font = '24px Arial';
    ctx.fillText(`${lessons.length} lessons completed • ${calculateTotalDuration(lessons)} minutes of content`, canvas.width / 2, 590);

    // Signature line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 150, 700);
    ctx.lineTo(canvas.width / 2 + 150, 700);
    ctx.stroke();

    ctx.font = '24px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Authorized Signature', canvas.width / 2, 730);

    // Award icon (simple star)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    const centerX = 150;
    const centerY = 150;
    const spikes = 5;
    const outerRadius = 40;
    const innerRadius = 20;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();

    return canvas;
  };

  const downloadCertificate = () => {
    if (downloaded) {
      alert('You have already downloaded the certificate.');
      return;
    }
    const canvas = generateCertificate();
    const link = document.createElement('a');
    link.download = `${state?.title || 'Course'}_Certificate.png`;
    link.href = canvas.toDataURL();
    link.click();

    localStorage.setItem('certificateDownloaded', 'true');
    setDownloaded(true);

    // Also save completion status to backend (optional)
    fetch('http://localhost:4000/multivendor/complete-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: auth.vendorid,
        courseid: courseid,
        completionDate: new Date().toISOString(),
        lessonsCompleted: completedLessons.size
      })

    }).catch(err => console.log('Could not save completion status:', err));

  };


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



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
          >
            ← Back to Course
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{state?.title}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {calculateTotalDuration(lessons)} min total
                </span>
              </div>
            </div>
            {isCoursecompleted() && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Award size={20} />
                View Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Course Completion Banner */}
        {isCoursecompleted() && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Congratulations! You've completed the course!
                </h3>
                <p className="text-green-700">
                  You've successfully finished all {lessons.length} lessons. Download your certificate to showcase your achievement.
                </p>
              </div>
              <button
                onClick={downloadCertificate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              // disabled={downloaded}
              >
                <Download size={20} />
                Download Certificate
              </button>
            </div>
          </div>
        )}

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No lessons found</h3>
            <p className="text-gray-500">This course doesn't have any lessons yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              {selectedLesson && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-black">
                    <video
                      src={url + selectedLesson.coursevideo}
                      muted={false}
                      controls
                      className="w-full h-full"
                      onEnded={() => markAsCompleted(selectedLesson._id)}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedLesson.coursetitle}
                      </h2>
                      {completedLessons.has(selectedLesson._id) && (
                        <CheckCircle className="text-green-500" size={24} />
                      )}

                      <div>
                        <button onClick={() => markAsCompleted(selectedLesson._id, selectedLesson.insid)}>Completed</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatDuration(selectedLesson.courseduration)}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                        {selectedLesson.sectionview?.section || 'General'}
                      </span>
                    </div>
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedLesson.summary || 'No summary available for this lesson.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Sidebar */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Course Content</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {completedLessons.size} of {lessons.length} completed
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {Object.entries(groupedLessons).map(([section, sectionLessons]) => (
                  <div key={section} className="border-b last:border-b-0">
                    <div className="p-4 bg-gray-50 border-b">
                      <h4 className="font-semibold text-gray-900">{section}</h4>
                      <p className="text-sm text-gray-600">
                        {sectionLessons.length} lesson{sectionLessons.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {sectionLessons.map((lesson, index) => (
                      <div
                        key={lesson._id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedLesson?._id === lesson._id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                          }`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {completedLessons.has(lesson._id) ? (
                              <CheckCircle className="text-green-500" size={20} />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <Play size={12} className="text-gray-400 ml-0.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 mb-1 line-clamp-2">
                              {lesson.coursetitle}
                            </h5>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} />
                              <span>{formatDuration(lesson.courseduration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="p-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((completedLessons.size / lessons.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
                  />
                </div>
                {isCoursecompleted() && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 font-medium">
                      <Award size={16} />
                      Course Completed!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-purple-600" size={28} />
                  Your Certificate
                </h2>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-purple-600" size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Congratulations, {auth.name || 'Student'}!
                </h3>
                <p className="text-gray-600">
                  You have successfully completed <strong>{state?.title}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Completed {lessons.length} lessons • {calculateTotalDuration(lessons)} minutes of content
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadCertificate}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                // disabled={downloaded}
                >
                  <Download size={20} />
                  Download Certificate
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseLessons;