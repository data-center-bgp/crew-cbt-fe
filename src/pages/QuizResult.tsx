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
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          {/* header */}
          <div className="px-6 py-4 text-white bg-blue-500">
            <h2 className="flex items-center justify-center text-2xl font-bold">
              Hasil Tes
            </h2>
          </div>

          {/* user information */}
          <div className="px-6 py-4 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nama Crew</p>
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
            <div className="mb-4 text-6xl font-bold">
              <span className={getScoreColor(result.score, result.total)}>
                {result.score}
              </span>
              <span className="text-black">/{result.total}</span>
            </div>
            <p className="mb-2 text-lg">
              {result.passed ? (
                <span className="text-green-600">
                  Selamat! Anda lulus tes! 🎉
                </span>
              ) : (
                <span className="text-red-600">
                  Mohon maaf, Anda belum berhasil lulus tes 😢
                </span>
              )}
            </p>
            <p className="text-gray-600">
              Nilai kelulusan: {result.passing_score} (
              {Math.round((result.passing_score / result.total) * 100)}%)
            </p>
          </div>

          {/* details */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-600">Durasi Tes</p>
                <p className="font-semibold">{formatTime(result.time_taken)}</p>
              </div>
              <div>
                <p className="text-gray-600">Persentase Skor</p>
                <p className="font-semibold">
                  {Math.round((result.score / result.total) * 100)}%
                </p>
              </div>
            </div>
          </div>
          {/* action buttons */}
          <div className="flex justify-center px-6 py-4 space-x-4 font-bold">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-gray-800 transition-colors bg-gray-200 rounded hover:bg-gray-300"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
