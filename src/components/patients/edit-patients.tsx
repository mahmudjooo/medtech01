import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { api } from "@/service/api";
import type { Role } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

interface ExpandMoreProps extends React.ComponentProps<typeof IconButton> {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
}));

function stringAvatar(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return {
    sx: {
      bgcolor: "#1976d2",
      width: 56,
      height: 56,
      fontSize: 24,
      fontWeight: "bold",
    },
    children: initials,
  };
}

const PatientsUser = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(
    null
  );
  const [editedData, setEditedData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
      const data = response.data.items ?? response.data;
      setPatients(data);
    } catch (error) {
      console.error("Fetch patients error:", error);
      setError("Foydalanuvchilarni olishda xatolik yuz berdi");
    }
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id: string) => {
    // O'chirishni confirm qilish o'rniga alert xabari bilan davom ettiramiz
    try {
      await api.delete(`/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setSuccessMessage("Patient muvaffaqiyatli o'chirildi");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Delete failed";
      setError(msg);
    }
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedData({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      phone: patient.phone || "",
    });
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await api.patch(
        `/patients/${selectedPatient.id}`,
        editedData
      );
      const updatedPatient = response.data;
      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id ? { ...p, ...updatedPatient } : p
        )
      );
      setIsDialogOpen(false);
      setSelectedPatient(null);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Save failed";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleExpandClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <>
      <Container sx={{ mt: "80px", mb: 6 }}>
        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        <Grid container spacing={3} justifyContent="center">
          {patients.map((patient) => {
            const fullName = `${patient.firstName} ${patient.lastName}`;
            return (
              <Grid key={patient.id} item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    width: 600,
                    height: 300,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 3,
                  }}
                >
                  <CardHeader
                    avatar={<Avatar {...stringAvatar(fullName)} />}
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={
                      <Typography variant="h6" fontWeight="bold">
                        {fullName}
                      </Typography>
                    }
                    subheader={new Date(patient.createdAt).toLocaleDateString()}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                    >
                      Email: {patient.email}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                    >
                      Phone: {patient.phone}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: "flex", gap: "20px" }}
                    disableSpacing
                  >
                    <Button
                      size="small"
                      onClick={() => handleEditClick(patient)}
                      sx={{ textTransform: "none" }}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(patient.id)}
                      sx={{ textTransform: "none" }}
                      color="error"
                      variant="outlined"
                    >
                      Delete
                    </Button>

                    <ExpandMore
                      expand={expandedId === patient.id}
                      onClick={() => handleExpandClick(patient.id)}
                      aria-expanded={expandedId === patient.id}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse
                    in={expandedId === patient.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Additional Info:
                      </Typography>
                      <Typography paragraph>
                        <b>Gender:</b> {patient.gender}
                      </Typography>
                      <Typography paragraph>
                        <b>Notes:</b> {patient.notes || "No additional notes"}
                      </Typography>
                      <Typography paragraph>
                        <b>Created At:</b>{" "}
                        {new Date(patient.createdAt).toLocaleString()}
                      </Typography>
                      <Typography paragraph>
                        <b>Updated At:</b>{" "}
                        {new Date(patient.updatedAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            value={editedData.firstName}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editedData.lastName}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={editedData.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            name="phone"
            value={editedData.phone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PatientsUser;
