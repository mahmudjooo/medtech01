import { useEffect, useState } from "react";
import { api } from "@/service/api";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

function PatientsProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    // Bemor ma'lumotlarini yuklash
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        setPatient(res.data);
      } catch (error) {
        console.error("Error fetching patient", error);
        setPatient(null);
      } finally {
        setLoadingPatient(false);
      }
    };

    // Bemorning yozuvlarini yuklash
    const fetchRecords = async () => {
      try {
        const res = await api.get(`/patients/${id}/records`);
        setRecords(res.data.items || []);
      } catch (error) {
        console.error("Error fetching records", error);
        setRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (id) {
      fetchPatient();
      fetchRecords();
    }
  }, [id]);

  if (loadingPatient || loadingRecords) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return <Typography align="center">Bemor topilmadi</Typography>;
  }

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Card sx={{ mb: 3 }}>
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

      <Typography variant="h6" gutterBottom>
        Tibbiy yozuvlar ({records.length})
      </Typography>
      {records.length === 0 ? (
        <Typography color="text.secondary">
          Hech qanday yozuv topilmadi.
        </Typography>
      ) : (
        <List>
          {records.map((record) => (
            <div key={record.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${
                    record.type.charAt(0).toUpperCase() + record.type.slice(1)
                  }`}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Tavsif:{" "}
                      </Typography>
                      {record.description || "—"} <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Recept:{" "}
                      </Typography>
                      {record.prescription || "—"} <br />
                      <Typography variant="caption" color="text.secondary">
                        Qo‘shilgan sana:{" "}
                        {new Date(record.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </div>
          ))}
        </List>
      )}
    </Container>
  );
}

export default PatientsProfile;
