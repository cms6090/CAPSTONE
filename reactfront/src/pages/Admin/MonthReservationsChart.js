import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 필요한 Chart.js 요소 등록
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function MonthReservationsChart() {
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationResponse = await fetch(
          'http://localhost:3000/api/statistics/reservations',
        );
        const reservations = await reservationResponse.json();
        setReservationData(reservations);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setError('데이터를 가져오는 데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // 월 이름 배열
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  // 2023년, 2024년 데이터를 월별로 분리
  const data2023 = Array(12).fill(0);
  const data2024 = Array(12).fill(0);

  reservationData.forEach((item) => {
    const date = new Date(item.date);
    const month = date.getMonth(); // 0부터 11까지의 값 (1월 ~ 12월)
    const year = date.getFullYear();

    if (year === 2023) {
      data2023[month] = item.count;
    } else if (year === 2024) {
      data2024[month] = item.count;
    }
  });

  return (
    <div
      style={{
        padding: '1em',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <div>월별 예약 현황</div>
      <Line
        data={{
          labels: months,
          datasets: [
            {
              label: '2023년',
              data: data2023,
              borderColor: '#0785F2',
              backgroundColor: 'rgba(7, 133, 242, 0.2)',
              tension: 0.3,
            },
            {
              label: '2024년',
              data: data2024,
              borderColor: '#D9644A',
              backgroundColor: 'rgba(217, 100, 74, 0.2)',
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '월',
              },
            },
            y: {
              title: {
                display: true,
                text: '예약 수',
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}

export default MonthReservationsChart;
