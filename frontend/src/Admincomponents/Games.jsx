import React, { useState, useEffect } from 'react';
import { Brain, Zap, Award, ArrowLeft, FileText, BarChart3, Sparkles, Target, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
const AptitudeGame = () => {
  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [solution, setSolution] = useState('');
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '';

  const topics = [
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Data Interpretation',
    'Verbal Ability',
    'Analytical Thinking'
  ];

  const generateQuestion = async () => {
    setLoading(true);
    setFeedback('');
    setSelected('');
    setSolution('');

    const topic = topics[Math.floor(Math.random() * topics.length)];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Generate one aptitude multiple choice question (MCQ) in the topic: ${topic}. Include 4 options (A, B, C, D) and clearly mark the correct answer with: answer: <correct_option_letter>. Also provide a short explanation of the answer after a new line like: solution: <brief explanation>. Format:

Question: ...
A. ...
B. ...
C. ...
D. ...
answer: ...
solution: ...`
            }
          ],
          max_tokens: 300
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const lines = content.split('\n').filter((line) => line.trim() !== '');
      const q = lines.find((l) => l.toLowerCase().startsWith('question'));
      const opts = lines.filter((l) => /^[A-D]\./.test(l.trim()));
      const answerLine = lines.find((l) => l.toLowerCase().startsWith('answer'));
      const solutionLine = lines.find((l) => l.toLowerCase().startsWith('solution'));

      const correctOptionLetter = answerLine.split(':')[1].trim();
      const correctOptionText = opts.find(opt => opt.startsWith(correctOptionLetter + '.'));

      setQuestion(q.replace('Question: ', '').trim());
      setOptions(opts);
      setCorrectAnswer(correctOptionText.slice(3).trim());
      setSolution(solutionLine ? solutionLine.split(':')[1].trim() : '');
    } catch (error) {
      console.error(error);
      setQuestion('Error generating question. Please try again.');
    }
    setLoading(false);
  };

  const checkAnswer = (selectedOption) => {
    setSelected(selectedOption);
    if (selectedOption.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong. Correct answer: ${correctAnswer}`);
    }
  };

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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4s"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-gray-300 opacity-40 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Aptitude Mastery
          </h1>
          <p className="text-xl text-gray-600 font-light tracking-wide">
            Elevate your cognitive abilities with AI-powered challenges
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            <span className="text-gray-700 font-medium">Powered by Advanced AI</span>
            <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          </div>
        </header>

        {/* Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button 
            className="group flex items-center gap-2 px-6 py-3 bg-gray-100 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-200 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
            // onClick={() => window.history.back()}
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </button>
          
          <Link to='/aptitudetest'>
          <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white font-medium hover:from-red-600 hover:to-pink-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
            <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Take Test
          </button></Link>
          <Link to='/report'>
          <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-medium hover:from-green-600 hover:to-teal-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
            <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            My Report
          </button></Link>
          
          <button 
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full text-white font-bold text-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
            onClick={generateQuestion}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10">Generating Magic...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span className="relative z-10">Generate Question</span>
              </>
            )}
          </button>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          {question ? (
            <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden animate-fadeIn">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold text-lg">Challenge Question</span>
                </div>
              </div>

              <div className="p-8">
                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mb-4">
                    {question}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-4 mb-8">
                  {options.map((opt, idx) => {
                    const optionText = opt.slice(3).trim();
                    const optionLetter = opt.charAt(0);
                    const isSelected = selected === optionText;
                    const isDisabled = !!feedback;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => checkAnswer(optionText)}
                        disabled={isDisabled}
                        className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                          isSelected 
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md'
                        } ${isDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300 ${
                            isSelected 
                              ? 'bg-purple-500 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                          }`}>
                            {optionLetter}
                          </div>
                          <span className="text-lg text-gray-800 font-medium flex-1 pt-1">
                            {optionText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className={`p-6 rounded-2xl mb-6 border-l-4 animate-slideIn ${
                    feedback.includes('✅') 
                      ? 'bg-green-50 border-green-500 text-green-800' 
                      : 'bg-red-50 border-red-500 text-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {feedback.includes('✅') ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className="text-xl font-bold">{feedback}</span>
                    </div>
                  </div>
                )}

                {/* Solution */}
                {feedback && solution && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 animate-slideIn">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-2">
                          💡 Explanation
                        </h3>
                        <p className="text-blue-800 leading-relaxed">
                          {solution}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : !loading && (
            <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 p-12 text-center animate-fadeIn">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6 shadow-lg">
                  <Target className="w-12 h-12 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to Challenge Yourself?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Click the "Generate Question" button to start your aptitude journey!
                </p>
                <div className="flex items-center justify-center space-x-2 text-purple-600">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Boost your cognitive skills</span>
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        
        .animation-delay-2s {
          animation-delay: 2s;
        }
        
        .animation-delay-4s {
          animation-delay: 4s;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AptitudeGame;