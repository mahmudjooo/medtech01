import { useEffect, useState } from "react";
import { api } from "@/service/api"; // sizdagi api
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

function PatientsProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`/patients/${id}`);
      setPatient(res.data);
    } catch (error) {
      console.error("Error fetching patient", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!patient) {
    return <p style={{ textAlign: "center" }}>Bemor topilmadi</p>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 500, margin: "0 auto", p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {patient.firstName} {patient.lastName}
          </Typography>
          <Typography variant="body1">📞 Telefon: {patient.phone}</Typography>
          <Typography variant="body2" color="text.secondary">
            🆔 ID: {patient.id}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PatientsProfile;
