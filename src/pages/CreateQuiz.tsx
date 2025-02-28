import { useState, useEffect } from "react";

interface Answer {
  text: string;
  is_correct: boolean;
}

interface Category {
  ID: number;
  Nama: string;
}

interface Question {
  quiz_category_id: number;
  text: string;
  image_url: string | null;
  answers: Answer[];
}

const CreateQuiz = () => {
  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const addAnswer = () => {
    setAnswers([...answers, { text: "", is_correct: false }]);
  };

  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/crew_cbt/quiz/categories`
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAnswerChange = (
    index: number,
    field: keyof Answer,
    value: string | boolean
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    try {
      const questionData: Question = {
        quiz_category_id: selectedCategory,
        text: questionText,
        image_url: imageUrl,
        answers: answers.map((answer) => ({
          text: answer.text,
          is_correct: answer.is_correct,
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/crew_cbt/quiz/createQuestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        }
      );

      if (!response.ok) throw new Error("Failed to create quiz question");

      // Reset form
      setQuestionText("");
      setImageUrl("");
      setAnswers([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
      alert("Quiz question created successfully!");
    } catch (error) {
      console.error("Error creating quiz question: ", error);
      alert("Failed to create quiz question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.ID} value={cat.ID}>
                    {cat.Nama}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focys:ring-blue-500"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                rows={3}
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Image URL (Optional)
            </label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Answers</h3>
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={answer.text}
                  onChange={(e) =>
                    handleAnswerChange(index, "text", e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                  required
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={answer.is_correct}
                    onChange={() => {
                      const newAnswers = answers.map((a, i) => ({
                        ...a,
                        is_correct: i === index,
                      }));
                      setAnswers(newAnswers);
                    }}
                    required
                  />
                  <span className="text-sm text-gray-600">Correct</span>
                </label>
                {answers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeAnswer(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove Answer
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAnswer}
              className="mt-2 px-4 py-2 text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              + Add Answer
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
