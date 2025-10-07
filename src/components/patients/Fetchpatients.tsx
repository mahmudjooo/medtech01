import { api } from "@/service/api";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function FetchPatients() {
  const [patients, setPatients] = useState([]); // ✅ default bo‘sh array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data.items);
    } catch (err) {
      console.error("Error fetching patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {patients.map((item) => (
          <Grid item key={item.id}>
            <Card
              onClick={() => navigate(`/reception/patient/${item.id}`)}
              sx={{
                width: 300,
                height: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.firstName} {item.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📞 {item.phone}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default FetchPatients;
