import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Category {
  ID: number;
  Nama: string;
}

const SelectCategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const nama = location.state?.nama;
  const nik = location.state?.nik;

  useEffect(() => {
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
    setIsLoading(true);
    try {
      navigate("/quiz", {
        state: {
          category: selectedCategory,
          nama,
          nik,
        },
      });
    } catch (error) {
      console.error("Error navigating to quiz: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
          Pilih Kategori Tes
        </h2>

        {/* Quiz instructions */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            PETUNJUK SEBELUM MEMULAI CBT
          </h3>
          <ol className="space-y-2 text-gray-800 list-decimal list-inside">
            <li>
              Pilih kategori sesuai yang telah ditentukan oleh admin sebelum
              melakukan tes, jangan sampai salah memilih kategori tes.
            </li>
            <li>
              Tipe soal adalah pilihan ganda dengan jumlah soal yang
              berbeda-beda tiap kategorinya. Pilihlah jawaban yang menurut Anda
              paling benar.
            </li>
            <li>
              Durasi tes selama 60 menit, dimana waktu akan terus berjalan dan
              tidak bisa dijeda. Mohon untuk memeriksa kembali jawaban tes
              sebelum mengirimkan jawaban.
            </li>
            <li>
              Hasil tes akan langsung ditampilkan setelah menyelesaikan tes.
              Mohon untuk melaporkan ke admin untuk pencatatan hasil tes.
            </li>
          </ol>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={!selectedCategory || isLoading}
              className={`
                px-8 py-3 rounded-md text-white font-medium
                transition-all duration-300 min-h-[48px] min-w-[160px]
                flex items-center justify-center
                ${
                  selectedCategory
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-pointer"
                }
              `}
            >
              {isLoading ? (
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
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                "Mulai Tes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectCategoryPage;
