import { api } from "@/service/api";
import React, { useEffect, useState, useCallback } from "react";

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
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"startAsc" | "startDesc" | "createdDesc">(
    "createdDesc"
  );

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
  }, [offset, limit, sort, doctorId, patientId, status]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const pages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // O‘chirish funksiyasi alert bilan
  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert("Appointment muvaffaqiyatli o‘chirildi.");
      loadAppointments();
    } catch (e: any) {
      alert("O‘chirishda xatolik: " + (e.message || "Nomaʼlum xatolik"));
    }
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Appointments</h1>

      {/* Filterlar */}
      <div
        style={{
          marginBottom: 30,
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        />
        <input
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            minWidth: 120,
          }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            minWidth: 140,
          }}
        >
          <option value="">Barchasi</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            minWidth: 160,
          }}
        >
          <option value="createdDesc">Yangi birinchi</option>
          <option value="startAsc">Boshlanish ↑</option>
          <option value="startDesc">Boshlanish ↓</option>
        </select>
      </div>

      {/* Natija */}
      {loading && <p style={{ textAlign: "center" }}>Yuklanmoqda...</p>}

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>Xatolik: {error}</p>
      )}

      {!loading && !error && (
        <>
          <p
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Topildi: {total} ta appointment, sahifa {currentPage} / {pages}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {appointments.map((a) => (
              <div
                key={a.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 20,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: 10,
                      fontSize: "1.2rem",
                      color: "#333",
                    }}
                  >
                    {a.reason || "Sabab ko‘rsatilmagan"}
                  </h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          a.status === "confirmed"
                            ? "green"
                            : a.status === "cancelled"
                            ? "red"
                            : "#555",
                        textTransform: "capitalize",
                        fontWeight: "600",
                      }}
                    >
                      {a.status}
                    </span>
                  </p>
                  <p>
                    <strong>Vaqti:</strong>{" "}
                    {new Date(a.startAt).toLocaleString()} -{" "}
                    {new Date(a.endAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {a.doctor.firstname}{" "}
                    {a.doctor.lastname}
                  </p>
                  <p>
                    <strong>Patient:</strong> {a.patient.firstName}{" "}
                    {a.patient.lastName}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(a.id)}
                  style={{
                    marginTop: 15,
                    backgroundColor: "#d32f2f",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 15px",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#b71c1c")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d32f2f")
                  }
                >
                  O‘chirish
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
              gap: 15,
            }}
          >
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: offset === 0 ? "#eee" : "#fff",
                cursor: offset === 0 ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              &lt; Oldingi
            </button>
            <button
              onClick={() =>
                setOffset(Math.min(offset + limit, (pages - 1) * limit))
              }
              disabled={offset + limit >= total}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: offset + limit >= total ? "#eee" : "#fff",
                cursor: offset + limit >= total ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Keyingi &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentsPage;
