import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';

export default function GenderAge() {
  const [userDemographics, setUserDemographics] = useState([]);
  const [reservationsPerDayCombined, setReservationsPerDayCombined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demographicsResponse = await fetch(
          'http://localhost:3000/api/statistics/demographics',
        );
        const data = await demographicsResponse.json();

        setUserDemographics(data.demographicsData);
        setReservationsPerDayCombined(data.reservationsPerDayCombined);
        console.log(data);
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

  // 차트에 사용할 데이터 준비
  const labels = reservationsPerDayCombined.map((item) => item.dayName);
  const thisMonthData = reservationsPerDayCombined.map((item) => item.thisMonth);
  const lastMonthData = reservationsPerDayCombined.map((item) => item.lastMonth);

  return (
    <div
      style={{
        padding: '1em',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div>사용자 연령대 및 성별</div>
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
      </div>
      <div>
        <div style={{ marginTop: '2em' }}>최근 2달의 요일별 예약 횟수</div>
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: '이번 달',
                data: thisMonthData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: '저번 달',
                data: lastMonthData,
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
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
