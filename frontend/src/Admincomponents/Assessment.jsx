import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [scores, setScores] = useState([]);
  const [stage, setStage] = useState('intro');
  const { state } = useLocation();

  const courseid = state?.courseid;

  const openaiKey = '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';

  const callOpenAI = async (prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const handleGenerateQuestions = async () => {
    const prompt = `Generate 10 descriptive assessment questions for a course titled "${state?.title}" with this description: "${state?.shortdescription}". Keep the questions open-ended and suitable for evaluating understanding. Return only the questions in a numbered list.`;
    const response = await callOpenAI(prompt);
    const lines = response.split('\n').filter(q => q.match(/^\d+\./)).map(q => q.replace(/^\d+\.\s*/, ''));
    setQuestions(lines);
    setStage('question');
  };

  const handleSubmitAnswer = async () => {
    const question = questions[currentIndex];
    const prompt = `Evaluate the following answer to a question. Score it out of 10 with a short justification.\n\nQuestion: "${question}"\n\nAnswer: "${currentAnswer}"\n\nGive response as:\nScore: X/10\nReason: <short explanation>`;
    const response = await callOpenAI(prompt);
    const match = response.match(/Score:\s*(\d{1,2})\/10/i);
    const score = match ? parseInt(match[1]) : 0;
    setAnswers([...answers, currentAnswer]);
    setScores([...scores, { score, feedback: response }]);
    setCurrentAnswer('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStage('result');
    }
  };

  useEffect(() => {
    handleGenerateQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {stage === 'intro' && (
          <div className="text-center animate-pulse">
            <h1 className="text-3xl font-bold text-blue-700">Preparing Your Assessment...</h1>
            <p className="text-gray-500 mt-4">Please wait while we generate your questions.</p>
          </div>
        )}

        {stage === 'question' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-700">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <p className="text-gray-700 text-lg">{questions[currentIndex]}</p>
            <textarea
              className="w-full min-h-[150px] p-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-200 resize-none"
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
            <div className="text-right">
              <button
                onClick={handleSubmitAnswer}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition duration-300 shadow-md"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-green-700">Assessment Results</h2>
            {scores.map((s, i) => (
              <div key={i} className="p-6 bg-green-50 rounded-xl border border-green-200 shadow-sm space-y-2">
                <p className="font-semibold text-gray-800">Q{i + 1}: {questions[i]}</p>
                <p className="text-gray-600"><strong>Answer:</strong> {answers[i]}</p>
                <p className="text-green-800"><strong>{s.feedback}</strong></p>
              </div>
            ))}
            <p className="text-2xl font-bold text-center text-green-800 mt-6">
              Total Score: {scores.reduce((acc, s) => acc + s.score, 0)} / 80
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
