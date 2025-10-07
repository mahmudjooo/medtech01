import { api } from "@/service/api";
import { useState } from "react";
type Role = "admin" | "doctor" | "reception";
type User = {
  id: string;
  email: string;
  role: Role;
  firsname: string;
  lastname: string;
  mustChangePassword: boolean;
};
interface ListResponse<T> {
  items: T[];
}
const CreateAppointment = () => {
  const [patients, setPatients] = useState("");
  const [doctor, setDoctor] = useState<User[]>([]);

  const fetchDoctor = async () => {
    const res = await api.get<ListResponse<User>>("/users");
    console.log(res);
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      return err;
    }
  };
  fetchPatients();
  return <div>CreateAppointment</div>;
};

export default CreateAppointment;
