import { api } from "@/service/api";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [q, setQ] = useState("");

  const fetchPatients = async () => {
    try {
      const params: any = {};
      if (q.trim()) {
        params.q = q.trim();
      }

      const res = await api.get("/patients", { params });
      const data = res.data.items ?? res.data;
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [q]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", py: 2 }}>
      <TextField
        onChange={handleSearch}
        variant="outlined"
        placeholder="Search patients..."
        size="small"
        fullWidth
        InputProps={{   
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          maxWidth: 400,
          mx: "auto",
          display: "block",
        }}
      />

      {patients.length === 0 ? (
        <Typography textAlign="center">No patients found.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          {patients.map((patient) => (
            <Card
              key={patient.id}
              sx={{
                width: 500,
                height: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 3,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Name : {patient.firstName}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  SurName : {patient.lastName}
                </Typography>
                <Typography variant="body1"> phone :{patient.phone}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PatientsList;
