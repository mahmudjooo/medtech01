import { api } from "@/service/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AppointmentsMe() {
  const [appMe, setAppMe] = useState<any>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchAppointments(id);
    }
  }, [id]);

  const fetchAppointments = async (id: string) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      setAppMe(response.data);
    } catch (error: any) {
      console.error(
        `Get appointment by ID ${id} error:`,
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h2>Appointment Details</h2>
      {appMe ? (
        <div>
          <p>Doctor ID: {appMe.doctorId}</p>
          <p>Patient ID: {appMe.patientId}</p>
          <p>Start At: {appMe.startAt}</p>
          <p>End At: {appMe.endAt}</p>
          <p>Status: {appMe.status}</p>
          {/* Qo'shimcha ma'lumotlarni shu yerda ko'rsatishingiz mumkin */}
        </div>
      ) : (
        <p>Loading appointment data...</p>
      )}
    </div>
  );
}

export default AppointmentsMe;
