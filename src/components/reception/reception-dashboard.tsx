import React, { useEffect, useState } from "react";
import { api } from "@/service/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const ReceptionDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/patients");
      const data = response.data.items ?? response.data;
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Bemorlarni olishda xatolik yuz berdi"
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

  // Oylar bo'yicha yangi bemorlar soni
  const patientsPerMonth: number[] = Array(12).fill(0);
  users.forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const monthIndex = date.getMonth();
      patientsPerMonth[monthIndex]++;
    }
  });

  // Bar ranglar palitrasi - faqat ko‘k rangning turli soyalaridan tashkil topgan
  const barColors = [
    "#003f5c", // juda quyuq ko‘k
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
    "#3a7bd5",
    "#5a9bf6",
    "#84b6f4",
    "#a9cef4",
  ];

  const patientsByMonthData = {
    labels: months,
    datasets: [
      {
        label: "Oylar bo'yicha yangi bemorlar",
        data: patientsPerMonth,
        backgroundColor: barColors,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#333",
        hoverBackgroundColor: "#ff6384",
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // grafik o'lchamini qo'lda boshqarish uchun
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 22, weight: "bold" } },
      },
      title: {
        display: true,
        font: { size: 28, weight: "bold" },
        text: "Oylar bo'yicha yangi bemorlar soni",
      },
      tooltip: {
        bodyFont: { size: 18 },
        titleFont: { size: 20, weight: "bold" },
      },
    },
    scales: {
      y: {
        ticks: { font: { size: 20 }, beginAtZero: true },
        grid: { color: "#ccc" },
      },
      x: {
        ticks: { font: { size: 18 } },
        grid: { color: "#eee" },
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
      <h1 className="dashboard-title">Bemorlar Dashboard</h1>
      <p className="total-users">Jami bemorlar soni: {users.length}</p>

      <div className="card card-fullwidth">
        <div style={{ height: "500px", width: "100%" }}>
          <Bar data={patientsByMonthData} options={options} />
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          padding: 3rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
        }

        .dashboard-title {
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .total-users {
          text-align: center;
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #444;
        }

        .card {
          background-color: white;
          border-radius: 25px;
          padding: 3rem 3.5rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          color: #111;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 0 auto;
          max-width: 1000px;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        }

        .loading-text,
        .error-text {
          font-size: 2rem;
          text-align: center;
          margin-top: 6rem;
          font-weight: 700;
        }

        .error-text {
          color: #dc3545;
        }

        @media (max-width: 900px) {
          .dashboard-title {
            font-size: 3rem;
          }

          .total-users {
            font-size: 1.8rem;
          }

          .card {
            padding: 2rem 2.5rem;
          }
        }

        @media (max-width: 600px) {
          .dashboard-title {
            font-size: 2.2rem;
          }

          .total-users {
            font-size: 1.4rem;
          }

          .card {
            padding: 1.5rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceptionDashboard;
