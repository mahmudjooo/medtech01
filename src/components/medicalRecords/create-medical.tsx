import { useState } from "react";
import axios from "axios";

export default function CreateMedicalRecordForm({
  patientId,
}: {
  patientId: string;
}) {
  const [type, setType] = useState("diagnosis");
  const [description, setDescription] = useState("");
  const [prescription, setPrescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/patients/${patientId}/records`, {
        type,
        description,
        prescription,
      });
      alert("Yozuv qo‘shildi");
      setDescription("");
      setPrescription("");
    } catch (err) {
      console.error("Xatolik:", err);
      alert("Yozuvni qo‘shib bo‘lmadi");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow-md max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold">Yangi yozuv qo‘shish</h3>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border w-full px-2 py-1"
      >
        <option value="diagnosis">Diagnosis</option>
        <option value="treatment">Treatment</option>
        <option value="note">Note</option>
      </select>

      <textarea
        placeholder="Tavsif (ixtiyoriy)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border w-full px-2 py-1"
        rows={3}
      />

      <input
        type="text"
        placeholder="Recept (ixtiyoriy)"
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
        className="border w-full px-2 py-1"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Yuklanmoqda..." : "Yozuvni saqlash"}
      </button>
    </form>
  );
}
