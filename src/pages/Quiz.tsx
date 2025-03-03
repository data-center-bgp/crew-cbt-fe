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
  const location = useLocation();
  const navigate = useNavigate();
  const { category, nik, nama } = location.state;

  console.log("Location state:", location.state);
  console.log("Nama:", nama);
  console.log("NIK:", nik);

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
        data.questions.forEach((q, index) => {
          console.log(`Question ${index + 1}:`, {
            text: q.Text,
            imageUrl: q.ImageUrl,
            hasImage: !!q.ImageUrl,
          });
        });
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions: ", error);
      }
    };
    fetchQuestions();
  }, [category]);

  const handleAnswerSelect = (questionIndex: number, answerId: number) => {
    console.log(`Question ${questionIndex}: selected answer ${answerId}`);
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerId,
    }));
  };

  const handleSubmit = useCallback(async () => {
    try {
      const answers = questions.map((_, index) => {
        return userAnswers[index] || 0;
      });
      console.log("Questions:", questions);
      console.log("User answers:", userAnswers);
      console.log("Final answers array:", answers);
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl font-bold">{countdown}</div>
      </div>
    );
  }

  if (!isQuizStarted || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* header */}
      <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow">
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
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-4">{questions[currentQuestion].Text}</p>
        {questions[currentQuestion].ImageUrl && (
          <img
            src={questions[currentQuestion].ImageUrl}
            alt="Question"
            className="max-w-full h-auto rounded mb-4"
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
      <div className="max-w-3xl mx-auto mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
