import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { rolePath } from "@/routes/role-path";
import { api } from "@/service/api";
import { useAuth } from "@/store/auth.store";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";

const Login = () => {
  // Email va parol uchun state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Yuklanish holati
  const [loading, setLoading] = useState(false);

  // Alert uchun message va severity (success, error, warning, info)
  const [alert, setAlert] = useState<{
    message: string;
    severity: "success" | "error" | "warning" | "info" | "";
  }>({ message: "", severity: "" });

  const nav = useNavigate();
  const { login } = useAuth();

  // Forma submit funksiyasi
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Har safar submit bo‘lganda alertni tozalab boramiz
    setAlert({ message: "", severity: "" });

    try {
      // API ga login so‘rov yuborish
      const { data } = await api.post("/auth/login", { email, password });

      // Token va user ma'lumotlarini store ga saqlash
      login(data.access_token, data.user);

      // Agar foydalanuvchi parolni o‘zgartirishi shart bo‘lsa
      if (data.user.mustChangePassword) {
        setAlert({
          message: "Parolingizni o‘zgartirishingiz kerak!",
          severity: "warning",
        });
        // Parol o‘zgartirish sahifasiga yo‘naltirish
        nav("/change-password", { replace: true });
        return;
      }

      // Muvaffaqiyatli login xabarini ko‘rsatish
      setAlert({
        message: `Xush kelibsiz, ${data.user.name || data.user.email}!`,
        severity: "success",
      });

      // Foydalanuvchi roliga qarab yo‘naltirish
      nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });
    } catch (error: any) {
      // Xatolik yuz bersa, error xabarini ko‘rsatish
      setAlert({
        message:
          error.response?.data?.message ||
          "Login bo‘lmadi. Iltimos, qayta urinib ko‘ring.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to right, #3b82f6, #8b5cf6)", // Ko‘kdan binafshagacha gradient
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: 400, p: 3, boxShadow: 6 }}>
        {/* Kartaning sarlavhasi */}
        <CardHeader
          title={
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Kirish
            </Typography>
          }
        />

        {/* Formani o‘z ichiga olgan asosiy qism */}
        <CardContent>
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Email kiritish */}
            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              placeholder="email@misol.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              fullWidth
            />

            {/* Parol label va unutilgan parol linki */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                component="label"
                htmlFor="password"
                sx={{ fontWeight: "medium" }}
              >
                Parol
              </Typography>
              <Link
                href="#"
                underline="hover"
                onClick={(e) => e.preventDefault()}
                sx={{ fontSize: "0.875rem", cursor: "pointer" }}
              >
                Esingdan chiqdimi?
              </Link>
            </Box>

            {/* Parol kiritish */}
            <TextField
              id="password"
              label="Parol"
              type="password"
              variant="outlined"
              placeholder="Parolingizni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              fullWidth
            />

            {/* Submit tugmasi */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, fontWeight: "bold" }}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </Box>
        </CardContent>

        {/* Alertni kartaning pastki qismida chiqarish */}
        {alert.message && (
          <CardActions>
            <Alert severity={alert.severity} sx={{ width: "100%" }}>
              {alert.message}
            </Alert>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default Login;
