import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Answer {
  ID: number;
  Text: string;
  IsCorrect: boolean;
}

interface Question {
  ID: number;
  Text: string;
  ImageUrl: string | null;
  Answers: Answer[];
}

interface QuizResponse {
  questions: Question[];
  questionOrder: number[];
}

const Quiz = () => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: number }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { category, nik, nama } = location.state;

  // Initial countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsQuizStarted(true);
    }
  }, [countdown]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/quiz/categories/${category}/`
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data: QuizResponse = await response.json();

        // Debug all questions with their image URLs
        data.questions.forEach(() => {});
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };
    fetchQuestions();
  }, [category]);

  const handleAnswerSelect = (questionIndex: number, answerId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const answers = questions.map((_, index) => {
        return userAnswers[index] || 0;
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/quiz/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            nama,
            nik,
            category_id: category,
            answers,
            time_taken: 600 - timeLeft,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(
          `Failed to submit quiz: ${errorData.error || "Unknown error"}`
        );
      }
      const result = await response.json();
      navigate("/quiz-result", { state: { result, nik, nama } });
    } catch (error) {
      console.error("Error submitting quiz: ", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [category, nik, nama, timeLeft, userAnswers, questions, navigate]);

  // Timer effect with handleSubmit in dependencies
  useEffect(() => {
    if (isQuizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isQuizStarted, handleSubmit]);

  if (countdown > 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="relative flex items-center justify-center">
          <span className="text-[200px] font-bold text-gray-700">
            {countdown}
          </span>
        </div>
      </div>
    );
  }

  if (!isQuizStarted || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* header */}
      <div className="flex items-center justify-between p-4 mb-8 bg-white rounded-lg shadow">
        <div className="text-lg">
          <p className="font-bold">{nama}</p>
          <p className="text-gray-600">{nik}</p>
        </div>
        <div className="text-2xl font-bold text-blue-500">
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>
      {/* questions */}
      <div className="max-w-3xl p-6 mx-auto mb-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="mb-4 text-lg">{questions[currentQuestion].Text}</p>
        {questions[currentQuestion].ImageUrl && (
          <img
            src={questions[currentQuestion].ImageUrl}
            alt="Question"
            className="h-auto max-w-full mb-4 rounded"
            onError={(e) => {
              console.error("Image failed to load:", {
                url: questions[currentQuestion].ImageUrl,
                questionId: questions[currentQuestion].ID,
              });
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = "none";
              target.parentElement?.insertAdjacentHTML(
                "beforeend",
                '<div class="p-4 bg-red-100 text-red-700 rounded">Failed to load image</div>'
              );
            }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        )}
        {/* answers */}
        <div className="grid grid-cols-1 gap-4">
          {questions[currentQuestion].Answers.map((answer) => (
            <button
              key={answer.ID}
              onClick={() => handleAnswerSelect(currentQuestion, answer.ID)}
              className={`p-4 text-left rounded-lg transition-all duration-200 transform hover:scale-105
                ${
                  userAnswers[currentQuestion] === answer.ID
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {answer.Text}
            </button>
          ))}
        </div>
      </div>

      {/* question navigation */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`p-2 text-center rounded ${
                userAnswers[index]
                  ? "bg-green-500 text-white"
                  : currentQuestion === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* submit button */}
      <div className="flex justify-end max-w-3xl mx-auto mt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-2">Mengirimkan jawaban...</span>
            </div>
          ) : (
            "Kirim Jawaban"
          )}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
