import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "@/service/api";

const SearchPatents = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (query.trim()) {
        params.q = query.trim();
      }

      const { data } = await api.get("/patients", { params });
      setUsers(data.items || data);
    } catch (error) {
      console.error("Users fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);
  console.log("Query:", query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    if (users.length > 0) {
      console.log("First user:", users[0]);
    }
  }, [users]);
  console.log(users);
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4, mt: 10 }}>
      <TextField
        label="Ism yoki email bo'yicha qidirish"
        variant="outlined"
        fullWidth
        size="medium"
        value={query}
        onChange={handleSearchChange}
        InputProps={{
          sx: { fontSize: "1.2rem", py: 1.5 },
          endAdornment: (
            <InputAdornment position="end">
              {loading ? <CircularProgress size={24} /> : <SearchIcon />}
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      {loading && users.length === 0 ? (
        <Typography align="center">Yuklanmoqda...</Typography>
      ) : users.length === 0 ? (
        <Typography align="center">Foydalanuvchi topilmadi</Typography>
      ) : (
        <Grid container spacing={4}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card elevation={4} sx={{ padding: 2, minHeight: 180 }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 3,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {user.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>First Name:</strong> {user.firstName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Last Name:</strong> {user.lastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Phone:</strong> {user.phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      <strong>Gender:</strong> {user.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {user.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchPatents;
