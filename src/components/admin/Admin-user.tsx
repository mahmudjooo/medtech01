import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../../store/auth.store";
import { api } from "@/service/api";

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedData, setEditedData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (q?: string) => {
    try {
      const response = await api.get("/users", {
        params: q ? { q } : {},
      });
      const data = response.data.items ?? response.data;
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Foydalanuvchilarni olishda xatolik");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Delete failed";
      setError(msg);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await api.patch(`/users/${user.id}/status`, {
        isActive: !user.isActive,
      });
      setUsers((oldUsers) =>
        oldUsers.map((u) =>
          u.id === user.id ? { ...u, isActive: response.data.isActive } : u
        )
      );
    } catch (err: any) {
      const message = err.response?.data?.message || "Status update failed";
      setError(message);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditedData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      role: user.role || "",
    });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setError(null);

    try {
      const response = await api.patch(`/users/${selectedUser.id}`, {
        firstname: editedData.firstname,
        lastname: editedData.lastname,
        email: editedData.email,
        role: editedData.role,
      });

      const updated = response.data;
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updated } : u))
      );
      setOpen(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const respRole = await api.patch(`/users/${selectedUser.id}/role`, {
            role: editedData.role,
          });
          setUsers((prev) =>
            prev.map((u) =>
              u.id === selectedUser.id ? { ...u, role: respRole.data.role } : u
            )
          );
          setOpen(false);
        } catch (err2: any) {
          setError(err2.response?.data?.message || "Update failed");
        }
      } else {
        setError(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Container sx={{ mt: "150px" }}>
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={() => setError(null)}
          >
            <Alert
              onClose={() => setError(null)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
        )}

        <Grid container spacing={4}>
          {users.map((user) => (
            <Grid item xs={12} md={6} key={user.id}>
              <Card
                sx={{
                  minHeight: 180,
                  borderRadius: 3,
                  boxShadow:
                    "0 8px 16px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {user.firstname} {user.lastname} {user.id}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 0.5 }}
                  >
                    {user.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Role: <strong>{user.role}</strong>
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pt: 0,
                    pb: 1,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.isActive}
                        onChange={() => handleToggleActive(user)}
                        color="primary"
                      />
                    }
                    label={user.isActive ? "Active" : "Blocked"}
                    sx={{ fontWeight: "bold" }}
                  />
                  <div>
                    <Button
                      size="medium"
                      color="primary"
                      variant="contained"
                      onClick={() => handleEditClick(user)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="medium"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstname"
            value={editedData.firstname}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={editedData.lastname}
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
            select
            label="Role"
            name="role"
            value={editedData.role}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="reception">Reception</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default User;
