import { Route, Routes } from "react-router-dom";
import Login from "./page/login";
import { RoleRoute } from "./routes/role-route";
import { AuthRefresh } from "./bootstrap/auth-refresh";
import ChangePassword from "./page/change-password";
import CreateUserForm from "./components/users/create-users";
import MiniDrawer from "./components/admin/admin-Saidbar";
import ChartOnlyDashboard from "./components/admin/Dashboard";
import CreatePatientForm from "./components/patients/create-patient";
import UsersSearch from "./components/admin/search-User";
import User from "./components/admin/Admin-user";
import SearchPatents from "./components/patients/SearchPatients";
import PatientsUser from "./components/patients/edit-patients";
import ReceptionDashboard from "./components/reception/reception-dashboard";
import PatientsList from "./components/doctor/patientsList";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import Reception from "./page/reception";
import PatientsProfile from "./components/patients/Patients-Profile";
import FetchPatients from "./components/patients/Fetchpatients";
import DoctorSaidebar from "./components/doctor/doctor-Saidebar";
import CreateAppointment from "./components/appointments/create-appointment";
import CreateMedicalRecordForm from "./components/medicalRecords/create-medical";
import AppointmentsPage from "./components/appointments/listAppoinments";

function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin"]}>
                <MiniDrawer />
              </RoleRoute>
            }
          >
            <Route path="add" element={<CreateUserForm />} />
            <Route path="search" element={<UsersSearch />} />
            <Route path="user" element={<User />} />
            <Route path="editPat" element={<PatientsUser />} />

            <Route path="dashboard" element={<ChartOnlyDashboard />} />
          </Route>

          <Route
            path="/doctor"
            element={
              <RoleRoute roles={["doctor"]}>
                <DoctorSaidebar />
              </RoleRoute>
            }
          >
            <Route path="patients" element={<PatientsList />} />
            <Route path="docDash" element={<DoctorDashboard />} />
          </Route>
          <Route
            path="/reception"
            element={
              <RoleRoute roles={["reception"]}>
                <Reception />
              </RoleRoute>
            }
          >
            <Route path="recDash" element={<ReceptionDashboard />} />
            <Route path="search" element={<SearchPatents />} />
            <Route path="editPat" element={<PatientsUser />} />
            <Route path="add-reception" element={<CreatePatientForm />} />
            <Route path="patient" element={<FetchPatients />} />
            <Route path="patient/:id" element={<PatientsProfile />} />
            <Route path="createappointment" element={<CreateAppointment />} />
            <Route path="createMedical" element={<CreateMedicalRecordForm />} />
            <Route path="listMedical" element={<AppointmentsPage />} />
          </Route>

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
