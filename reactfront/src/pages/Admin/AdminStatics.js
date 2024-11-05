import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, CircularProgress } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StatisticsPage() {
  const [reservationData, setReservationData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [userDemographics, setUserDemographics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationResponse = await fetch('http://localhost:3000/api/statistics/reservations');
        const reservations = await reservationResponse.json();
        setReservationData(reservations);

        const reviewResponse = await fetch('http://localhost:3000/api/statistics/reviews');
        const reviews = await reviewResponse.json();
        setReviewData(reviews);

        const demographicsResponse = await fetch('http://localhost:3000/api/statistics/demographics');
        const demographics = await demographicsResponse.json();
        setUserDemographics(demographics);
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
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

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
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        통계 대시보드
      </Typography>

      {/* 2023년과 2024년의 월별 예약 데이터 막대 그래프 */}
      <Box sx={{ marginBottom: '40px', width: '50%' }}>
        <Typography variant="h6">월별 예약 현황 (2023년 vs 2024년)</Typography>
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                label: '2023년',
                data: data2023,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: '2024년',
                data: data2024,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
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
          }}
        />
      </Box>

      {/* 리뷰 평점 분포 */}
      <Box sx={{ marginBottom: '40px', width: '50%' }}>
        <Typography variant="h6">리뷰 평점 분포</Typography>
        <Pie
          data={{
            labels: reviewData.map((item) => `${item.rating}점`),
            datasets: [
              {
                data: reviewData.map((item) => item.count),
              },
            ],
          }}
        />
      </Box>

      {/* 사용자 연령대 및 성별 */}
      <Box sx={{ marginBottom: '40px', width: '50%' }}>
        <Typography variant="h6">사용자 연령대 및 성별</Typography>
        <Bar
          data={{
            labels: userDemographics.map((item) => item.ageGroup),
            datasets: [
              {
                label: '남성',
                data: userDemographics.map((item) => item.maleCount),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
              },
              {
                label: '여성',
                data: userDemographics.map((item) => item.femaleCount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
          }}
        />
      </Box>
    </Box>
  );
}

export default StatisticsPage;
