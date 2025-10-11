import { api } from "@/service/api";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}
interface Doctor {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
}
interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  reason?: string;
  patient: Patient;
  doctor: Doctor;
}
interface ListResponse {
  total: number;
  offset: number;
  limit: number;
  items: Appointment[];
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"startAsc" | "startDesc" | "createdDesc">(
    "createdDesc"
  );

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const paramss: any = {};
      if (q.trim()) {
        paramss.q = q.trim();
      }

      const params: any = { offset, limit, sort };
      if (doctorId) params.doctorId = doctorId;
      if (patientId) params.patientId = patientId;
      if (status) params.status = status;

      const res = await api.get<ListResponse>("/appointments", { params });
      setAppointments(res.data.items);
      setTotal(res.data.total);
    } catch (e: any) {
      setError(e.message || "Nomaʼlum xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [offset, limit, sort, doctorId, patientId, status]);

  const pages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert("Appointment muvaffaqiyatli o‘chirildi.");
      fetchAppointments();
    } catch (e: any) {
      alert("O‘chirishda xatolik: " + (e.message || "Nomaʼlum xatolik"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "cancelled":
        return "red";
      case "scheduled":
        return "#ffa000";
      default:
        return "#555";
    }
  };

  const [q, setQ] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  return (
    <>
      <div className="w-full flex gap-20 items-center px-10">
        <div
          style={{
            padding: 24,
            maxWidth: 1100,
            margin: "auto",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 30 }}>
            📋 Appointmentlar
          </h1>

          {/* Filterlar */}
          <div
            style={{
              marginBottom: 25,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              placeholder="Doctor ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              style={inputStyle}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">Status (barchasi)</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              style={inputStyle}
            >
              <option value="startAsc">Boshlanish </option>
              <option value="startDesc">Boshlanish </option>
            </select>
          </div>

          {/* Xabarlar */}
          {loading && <p style={{ textAlign: "center" }}>⏳ Yuklanmoqda...</p>}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>❌ {error}</p>
          )}

          {/* Kartalar */}
          {!loading && !error && (
            <>
              <p style={{ textAlign: "center", marginBottom: 20 }}>
                Topildi: <b>{total}</b> appointment, sahifa <b>{currentPage}</b>{" "}
                / {pages}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 20,
                }}
              >
                {appointments.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      padding: 16,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <h3 style={{ marginBottom: 8 }}>
                      {a.reason || "📝 Sabab yo‘q"}
                    </h3>
                    <p>
                      <b>Status:</b>{" "}
                      <span
                        style={{
                          color: getStatusColor(a.status),
                          fontWeight: "bold",
                        }}
                      >
                        {a.status}
                      </span>
                    </p>
                    <p>
                      <b>Vaqti:</b> {new Date(a.startAt).toLocaleString()} -{" "}
                      {new Date(a.endAt).toLocaleString()}
                    </p>
                    <p>
                      <b>Doctor:</b> {a.doctor.firstname} {a.doctor.lastname}
                    </p>
                    <p>
                      <b>Patient:</b> {a.patient.firstName} {a.patient.lastName}
                    </p>

                    <button
                      onClick={() => handleDelete(a.id)}
                      style={{
                        marginTop: 12,
                        backgroundColor: "#d32f2f",
                        border: "none",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      🗑 O‘chirish
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  style={paginationButton(offset === 0)}
                >
                  ⬅ Oldingi
                </button>
                <button
                  onClick={() =>
                    setOffset(Math.min(offset + limit, (pages - 1) * limit))
                  }
                  disabled={offset + limit >= total}
                  style={paginationButton(offset + limit >= total)}
                >
                  Keyingi ➡
                </button>
              </div>
            </>
          )}
        </div>

        <div>
          <TextField sx={{ width: "250px" }} onChange={handleSearchChange} />
        </div>
      </div>
    </>
  );
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: 4,
  border: "1px solid #ccc",
  minWidth: 140,
};

const paginationButton = (disabled: boolean) => ({
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #ccc",
  backgroundColor: disabled ? "#eee" : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "bold",
});

export default AppointmentsPage;
