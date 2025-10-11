import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/service/api";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  email?: string;
}

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/patients");
        setPatients(res.data.items);
      } catch (err: any) {
        setError("Bemorlarni yuklashda xatolik yuz berdi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const goToPatientProfile = () => {
    navigate(`/doctor/patient/${p.id}`);
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bemorlar ro‘yxati</h2>
      {patients.length === 0 && <p>Bemorlar topilmadi.</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Ism</th>
            <th className="border border-gray-300 p-2 text-left">Familiya</th>
            <th className="border border-gray-300 p-2 text-left">Telefon</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-left">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{p.firstName}</td>
              <td className="border border-gray-300 p-2">{p.lastName}</td>
              <td className="border border-gray-300 p-2">{p.phone || "-"}</td>
              <td className="border border-gray-300 p-2">{p.email || "-"}</td>
              <td className="border border-gray-300 p-2">
                <Link
                  to={`/doctor/patient/${p.id}/records`}
                  className="text-blue-600 hover:underline"
                >
                  Yozuv qo‘shish
                </Link>
                <button onClick={() => navigate(p.id)}>Profilga o'tish</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
