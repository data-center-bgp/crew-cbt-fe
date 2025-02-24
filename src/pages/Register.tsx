import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    jabatan: "",
    perusahaan: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            name="nama"
            placeholder="Nama"
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            name="nik"
            placeholder="NIK"
            onChange={handleChange}
            required
            maxLength={16}
          />
          <input
            className="w-full p-2 border rounded"
            name="jabatan"
            placeholder="Jabatan"
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            name="perusahaan"
            placeholder="Perusahaan"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
