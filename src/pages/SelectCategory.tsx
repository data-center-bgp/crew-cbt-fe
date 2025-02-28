import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation

interface Category {
  ID: number;
  Nama: string;
}

const SelectCategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get location state
  const nama = location.state?.nama; // Get Nama from state
  const nik = location.state?.nik; // Get NIK from state

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/quiz/categories`
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/quiz", {
      state: {
        category: selectedCategory,
        nama,
        nik, // Pass NIK to quiz page
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Select Quiz Category
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.ID}
                onClick={() => setSelectedCategory(cat.ID)}
                className={`
                  p-6 rounded-lg shadow-md cursor-pointer
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-xl
                  ${
                    selectedCategory === cat.ID
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-blue-50"
                  }
                `}
              >
                <h3 className="text-xl font-semibold text-center">
                  {cat.Nama}
                </h3>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!selectedCategory}
              className={`
                px-8 py-3 rounded-md text-white font-medium
                transition-all duration-300
                ${
                  selectedCategory
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              Start Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectCategoryPage;
