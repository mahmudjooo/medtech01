import { api } from "@/service/api";
import { useEffect, useState } from "react";
import { LogoutButton } from "./logout";
import { FaUserAlt } from "react-icons/fa";

import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState<{ email?: string; role?: string }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  // Change password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openChangePassword = () => {
    handleCloseMenu();
    setDialogOpen(true);
  };
  const closeChangePassword = () => {
    setDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setError("");
    setSuccessMsg("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setSuccessMsg("Parol muvaffaqiyatli o'zgartirildi");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="gost"
        id="profile-button"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FaUserAlt className="size-6" />
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Typography variant="body2">{user.email}</Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Typography variant="body2" color="text.secondary">
            {user.role}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <LogoutButton />
        </MenuItem>
        <MenuItem onClick={openChangePassword}>Parolni o'zgartirish</MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={closeChangePassword}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Parolni o'zgartirish</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleChangePassword}
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Joriy parol"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Yangi parol"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            {successMsg && (
              <Typography color="success.main" variant="body2">
                {successMsg}
              </Typography>
            )}
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={closeChangePassword} disabled={loading}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Yuborilmoqda..." : "Saqlash"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
