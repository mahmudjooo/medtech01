import { api } from "@/service/api";
import { useState } from "react";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";

interface RoleChangeProps {
  id: string;
}

const RoleChange = ({ id }: RoleChangeProps) => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const changeRole = async () => {
    if (!role) return;
    setLoading(true);
    setMsg(null);
    setErr(null);

    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      console.log(response.data);
      setMsg("Rol muvaffaqiyatli o‘zgartirildi");
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Rolni o‘zgartirish
      </Typography>

      <TextField
        select
        label="Yangi rolni tanlang"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="doctor">Doctor</MenuItem>
        <MenuItem value="reception">Reception</MenuItem>
        <MenuItem value="user">User</MenuItem>
      </TextField>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={changeRole}
        disabled={loading || !role}
      >
        Rolni yangilash
      </Button>

      {msg && (
        <Typography color="green" sx={{ mt: 2 }}>
          {msg}
        </Typography>
      )}
      {err && (
        <Typography color="error" sx={{ mt: 2 }}>
          {err}
        </Typography>
      )}
    </Box>
  );
};

export default RoleChange;
