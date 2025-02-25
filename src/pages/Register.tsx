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
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      navigate("/select-category", {
        state: { nama: formData.nama, nik: formData.nik },
      });
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4 flex justify-center">
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
              <span className="text-red-500 text-sm">{errors.nama}</span>
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
              <span className="text-red-500 text-sm">{errors.nik}</span>
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
              <span className="text-red-500 text-sm">{errors.jabatan}</span>
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
              <span className="text-red-500 text-sm">{errors.perusahaan}</span>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
