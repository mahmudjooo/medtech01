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

const UsersSearch = () => {
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

      const { data } = await api.get("/users", { params });
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card elevation={3}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                    {user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
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

export default UsersSearch;
