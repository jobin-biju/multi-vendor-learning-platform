import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = '';

const AptitudeTestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const promises = Array.from({ length: 10 }, (_, index) =>
        axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: `Generate 1 unique aptitude MCQ (${index + 1}/10) with 4 options. Topics: math, logic, reasoning, verbal. 
                Format strictly as:
                Question: [question text]
                A. [option A]
                B. [option B] 
                C. [option C]
                D. [option D]
                Answer: [A/B/C/D]
                Solution: [brief explanation]`
              }
            ],
            max_tokens: 300,
            temperature: 0.8
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const results = await Promise.all(promises);
      const parsedQuestions = results.map((res, index) => {
        const content = res.data.choices[0].message.content;
        const lines = content.split('\n').filter((l) => l.trim());
        
        const questionLine = lines.find((l) => l.toLowerCase().startsWith('question'));
        const question = questionLine ? questionLine.replace(/^question:\s*/i, '') : `Question ${index + 1}`;
        
        const options = lines.filter((l) => /^[A-D]\./.test(l.trim()));
        
        const answerLine = lines.find((l) => l.toLowerCase().startsWith('answer'));
        const correctLetter = answerLine ? answerLine.split(':')[1].trim().toUpperCase() : 'A';
        const correctOption = options.find((opt) => opt.startsWith(correctLetter + '.'));

        const solutionLine = lines.find((l) => l.toLowerCase().startsWith('solution'));
        const solution = solutionLine ? solutionLine.replace(/^solution:\s*/i, '') : 'No explanation provided.';

        return { 
          id: index, 
          question, 
          options: options.length >= 4 ? options.slice(0, 4) : options, 
          correct: correctLetter,
          correctOption,
          solution 
        };
      });

      setQuestions(parsedQuestions.filter(q => q.options.length >= 4));
    } catch (error) {
      setError('Failed to generate questions. Please refresh the page to try again.');
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (qid, ans) => {
    setAnswers((prev) => ({ ...prev, [qid]: ans }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      let calculatedScore = 0;
      questions.forEach((q) => {
        const selected = answers[q.id];
        if (selected === q.correctOption) {
          calculatedScore++;
        }
      });
      
      setScore(calculatedScore);
      setSubmitted(true);

      if (auth?.vendorid) {
        const data = {
          userid: auth.vendorid,
          score: calculatedScore,
          totalQuestions: questions.length,
          timeSpent: 900 - timeLeft,
          percentage: Math.round((calculatedScore / questions.length) * 100)
        };

        await fetch('http://localhost:4000/multivendor/aptitudetest', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
    } catch (error) {
      setError('Failed to submit test results.');
      console.error('Error submitting test:', error);
    } finally {
      setSubmitting(false);
    }
  }, [questions, answers, auth, timeLeft, submitting]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getProgressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmit();
    }
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted, handleSubmit]);

  // Generate questions on mount
  useEffect(() => {
    generateQuestions();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        padding: 30, 
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          🧠 Generating your aptitude test...
        </div>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>🧠 Aptitude Test</h1>
        {!submitted && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '18px', 
              color: timeLeft < 300 ? '#dc3545' : '#007bff',
              fontWeight: 'bold'
            }}>
              ⏳ {formatTime(timeLeft)}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Progress: {getProgressPercentage()}% ({Object.keys(answers).length}/{questions.length})
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Progress Bar */}
      {!submitted && questions.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${getProgressPercentage()}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {/* Questions */}
      {!submitted && questions.map((q, index) => (
        <div key={q.id} style={{ 
          marginBottom: 30,
          padding: '25px',
          backgroundColor: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontWeight: 'bold', 
            marginBottom: '15px',
            color: '#495057'
          }}>
            Q{index + 1}. {q.question}
          </h3>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            {q.options.map((opt, idx) => (
              <label key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: answers[q.id] === opt ? '#e3f2fd' : '#f8f9fa',
                border: `2px solid ${answers[q.id] === opt ? '#2196f3' : '#e9ecef'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  onChange={() => handleChange(q.id, opt)}
                  checked={answers[q.id] === opt}
                  style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '16px' }}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      {!submitted && questions.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '15px 30px',
              backgroundColor: submitting ? '#6c757d' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {submitting ? '⏳ Submitting...' : '✅ Submit Test'}
          </button>
        </div>
      )}

      {/* Results */}
      {submitted && (
        <div>
          <div style={{ 
            textAlign: 'center',
            padding: '30px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: getScoreColor(), margin: '0 0 15px 0', fontSize: '2.5em' }}>
              {score} / {questions.length}
            </h2>
            <div style={{ fontSize: '20px', color: '#666' }}>
              {Math.round((score / questions.length) * 100)}% Score
            </div>
            <div style={{ fontSize: '16px', color: '#888', marginTop: '10px' }}>
              Time taken: {formatTime(900 - timeLeft)}
            </div>
          </div>

          <h3 style={{ marginTop: 30, marginBottom: 20, color: '#495057' }}>
            📋 Detailed Results:
          </h3>
          
          {questions.map((q, index) => {
            const selected = answers[q.id] || 'Not answered';
            const isCorrect = selected === q.correctOption;
            
            return (
              <div key={index} style={{ 
                marginBottom: 25, 
                padding: 20, 
                backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
                borderRadius: 10
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Q{index + 1}: {q.question}
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Your Answer:</strong> 
                  <span style={{ color: isCorrect ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                    {' '}{selected}
                  </span>
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Correct Answer:</strong> 
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                    {' '}{q.correctOption}
                  </span>
                </p>
                <p style={{ marginTop: '12px', fontStyle: 'italic' }}>
                  <strong>Explanation:</strong> {q.solution}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AptitudeTestPage;