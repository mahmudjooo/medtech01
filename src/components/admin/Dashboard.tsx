import React, { useEffect, useState } from "react";
import { api } from "@/service/api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      const data = response.data.items ?? response.data;
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Foydalanuvchilarni olishda xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

  const usersPerMonth: number[] = Array(12).fill(0);
  users.forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const monthIndex = date.getMonth();
      usersPerMonth[monthIndex]++;
    }
  });

  const usersByMonthData = {
    labels: months,
    datasets: [
      {
        label: "Oylar bo'yicha yangi foydalanuvchilar",
        data: usersPerMonth,
        backgroundColor: "rgba(54, 162, 235, 0.85)",
        borderRadius: 8,
      },
    ],
  };

  const rolesCount = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const activeCount = users.filter((u) => u.isActive).length;
  const blockedCount = users.length - activeCount;

  const activeBarData = {
    labels: ["Faol foydalanuvchilar", "Bloklangan foydalanuvchilar"],
    datasets: [
      {
        label: "Foydalanuvchilar soni",
        data: [activeCount, blockedCount],
        backgroundColor: ["rgba(40, 167, 69, 0.85)", "rgba(220, 53, 69, 0.85)"],
        borderRadius: 8,
      },
    ],
  };

  const rolesPieData = {
    labels: Object.keys(rolesCount),
    datasets: [
      {
        label: "Rol bo'yicha taqsimot",
        data: Object.values(rolesCount),
        backgroundColor: [
          "#FFC107",
          "#17A2B8",
          "#6F42C1",
          "#FD7E14",
          "#20C997",
          "#6610F2",
        ],
        hoverOffset: 25,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { font: { size: 18 } } },
      title: { display: true, font: { size: 24 }, text: "" },
    },
    scales: {
      y: {
        ticks: { font: { size: 16 } },
      },
      x: {
        ticks: { font: { size: 16 } },
      },
    },
  };

  if (loading) return <p className="loading-text">Yuklanmoqda...</p>;
  if (error)
    return (
      <p
        className="error-text"
        style={{ color: "#dc3545", textAlign: "center" }}
      >
        Xatolik: {error}
      </p>
    );

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      <p className="total-users">Ishchilar soni: {users.length}</p>

      <div className="dashboard-flex">
        <div className="card card-large">
          <h3>Faol va bloklangan foydalanuvchilar</h3>
          <Bar
            data={activeBarData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: { display: true, text: "Faol va Bloklanganlar" },
              },
            }}
          />
        </div>

        <div className="card card-large">
          <h3>Foydalanuvchilar roli bo'yicha taqsimot</h3>
          <Pie
            data={rolesPieData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: { display: true, text: "Rol bo'yicha taqsimot" },
              },
            }}
          />
        </div>

        <div className="card card-fullwidth">
          <h3>Oylar bo'yicha yangi foydalanuvchilar</h3>
          <Bar
            data={usersByMonthData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  display: true,
                  text: "Oylar bo'yicha foydalanuvchilar",
                },
              },
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
        }

        .dashboard-title {
          font-size: 3.5rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .total-users {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #444;
        }

        .dashboard-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 2.5rem;
          justify-content: center;
        }

        .card {
          background-color: white;
          border-radius: 25px;
          padding: 2.5rem 3rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          color: #111;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex-shrink: 0;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        }

        .card h3 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }

        .card-large {
          flex: 1 1 40%;
          min-width: 450px;
          max-width: 600px;
        }

        .card-fullwidth {
          flex: 1 1 100%;
          min-width: 900px;
          max-width: 100%;
        }

        .loading-text {
          font-size: 1.8rem;
          color: #666;
          text-align: center;
          margin-top: 5rem;
        }

        .error-text {
          font-size: 1.8rem;
          color: #dc3545;
          text-align: center;
          margin-top: 5rem;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .card-large {
            flex: 1 1 100%;
            min-width: auto;
            max-width: 100%;
          }

          .card-fullwidth {
            min-width: auto;
          }
        }

        @media (max-width: 600px) {
          .dashboard-title {
            font-size: 2.8rem;
          }

          .total-users {
            font-size: 1.6rem;
          }

          .card h3 {
            font-size: 1.4rem;
          }

          .card {
            padding: 1.8rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
