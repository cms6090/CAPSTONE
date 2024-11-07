import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';

export default function GenderAge() {
  const [userDemographics, setUserDemographics] = useState([]);
  const [reservationsPerDay, setReservationsPerDay] = useState([]);
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
        setReservationsPerDay(data.reservationsPerDay);
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
            labels: reservationsPerDay.map((item) => item.dayName),
            datasets: [
              {
                label: '예약 건수',
                data: reservationsPerDay.map((item) => item.reservationCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
