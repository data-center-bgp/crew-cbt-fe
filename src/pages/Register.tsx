import { useState } from "react";
import { useNavigate } from "react-router-dom";

type JobPosition =
  | "Nahkoda"
  | "Mualim 1"
  | "Mualim 2"
  | "Mualim 3"
  | "Mualim 4"
  | "KKM"
  | "Masinis 1"
  | "Masinis 2"
  | "Masinis 3"
  | "Masinis 4"
  | "Bosun"
  | "Mandor"
  | "AB"
  | "Oiler"
  | "Koki";

type Company = "ASG" | "BGP" | "BNI";

const JOB_POSITIONS: JobPosition[] = [
  "Nahkoda",
  "Mualim 1",
  "Mualim 2",
  "Mualim 3",
  "Mualim 4",
  "KKM",
  "Masinis 1",
  "Masinis 2",
  "Masinis 3",
  "Masinis 4",
  "Bosun",
  "Mandor",
  "AB",
  "Oiler",
  "Koki",
];

const COMPANIES: Company[] = ["ASG", "BGP", "BNI"];

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    jabatan: "",
    perusahaan: "",
  });
  const [errors, setErrors] = useState({
    nama: "",
    nik: "",
    jabatan: "",
    perusahaan: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "nik") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 16) return;
      setFormData({ ...formData, nik: numericValue });
      setErrors({
        ...errors,
        nik: numericValue.length === 16 ? "" : "NIK harus 16 digit!",
      });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({
        ...errors,
        [name]: value ? "" : "Nama tidak boleh kosong!",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      nama: formData.nama.trim() ? "" : "Nama tidak boleh kosong!",
      nik: formData.nik.length === 16 ? "" : "NIK harus 16 digit!",
      jabatan: formData.jabatan.trim()
        ? ""
        : "Pilih jabatan sesuai dengan pekerjaan Anda saat ini!",
      perusahaan: formData.perusahaan.trim()
        ? ""
        : "Pilih perusahaan tempat Anda bekerja saat ini!",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        navigate("/select-category", {
          state: { nama: formData.nama, nik: formData.nik },
        });
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://images.barokahperkasagroup.id/uploads/logo-bpg.png"
            alt="PT Barokah Perkasa Group Logo Company"
            className="w-auto h-24"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          COMPETENCY BASED TRAINING (CBT) TEST
        </h1>
        <h2 className="text-xl font-semibold text-gray-800">
          PT BAROKAH PERKASA GROUP
        </h2>
      </div>

      {/* Registration Form */}
      <div className="flex items-center justify-center">
        <div className="p-6 bg-white rounded-md shadow-md w-96">
          <h2 className="flex justify-center mb-4 text-xl font-bold">
            Masukkan Identitas Anda
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                className={`w-full p-2 border rounded ${
                  errors.nama ? "border-red-500" : ""
                }`}
                name="nama"
                value={formData.nama}
                placeholder="Nama"
                onChange={handleChange}
                required
              />
              {errors.nama && (
                <span className="text-sm text-red-500">{errors.nama}</span>
              )}
            </div>
            <div>
              <input
                className={`w-full p-2 border rounded ${
                  errors.nik ? "border-red-500" : ""
                }`}
                name="nik"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.nik}
                placeholder="NIK"
                onChange={handleChange}
                required
                maxLength={16}
              />
              {errors.nik && (
                <span className="text-sm text-red-500">{errors.nik}</span>
              )}
            </div>
            <div>
              <select
                className={`w-full p-2 border rounded ${
                  errors.jabatan ? "border-red-500" : ""
                }`}
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Jabatan
                </option>
                {JOB_POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.jabatan && (
                <span className="text-sm text-red-500">{errors.jabatan}</span>
              )}
            </div>
            <div>
              <select
                className={`w-full p-2 border rounded ${
                  errors.perusahaan ? "border-red-500" : ""
                }`}
                name="perusahaan"
                value={formData.perusahaan}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Perusahaan
                </option>
                {COMPANIES.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              {errors.perusahaan && (
                <span className="text-sm text-red-500">
                  {errors.perusahaan}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center min-h-[42px]"
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
                  <span className="ml-2">Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
