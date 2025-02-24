import { useLocation, useNavigate } from "react-router-dom";

interface QuizResult {
  user_id: number;
  category_id: number;
  score: number;
  total: number;
  passing_score: number;
  passed: boolean;
  time_taken: number;
}

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, nik, nama } = location.state as {
    result: QuizResult;
    nik: string;
    nama: string;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* header */}
          <div className="bg-blue-500 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">Quiz Result</h2>
          </div>

          {/* user information */}
          <div className="border-b px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{nama}</p>
              </div>
              <div>
                <p className="text-gray-600">NIK</p>
                <p className="font-semibold">{nik}</p>
              </div>
            </div>
          </div>

          {/* score result */}
          <div className="px-6 py-8 text-center">
            <div className="text-6xl font-bold mb-4">
              <span className={getScoreColor(result.score, result.total)}>
                {result.score}
              </span>
              <span className="text-gray-400">{result.total}</span>
            </div>
            <p className="text-lg mb-2">
              {result.passed ? (
                <span className="text-green-600">You passed the quiz! 🎉</span>
              ) : (
                <span className="text-red-600">You failed the quiz 😢</span>
              )}
            </p>
            <p className="text-gray-600">
              Passing score: {result.passing_score} (
              {Math.round((result.passing_score / result.total) * 100)}%)
            </p>
          </div>

          {/* details */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-600">Time Taken</p>
                <p className="font-semibold">{formatTime(result.time_taken)}</p>
              </div>
              <div>
                <p className="text-gray-600">Score Percentage</p>
                <p className="font-semibold">
                  {Math.round((result.score / result.total) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="px-6 py-4 flex justify-end space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/select-category")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Start Another Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
