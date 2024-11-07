import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress } from '@mui/material';

export default function Statistic() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 각각의 통계를 관리하는 상태
  const [usersCount, setUsersCount] = useState(0);
  const [lodgingsCount, setLodgingsCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [reservesCount, setReservesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/statistics/');
        const data = await response.json();

        // 상태에 저장
        setUsersCount(data.userCount);
        setLodgingsCount(data.lodgingCount);
        setRoomsCount(data.roomCount);
        setReservesCount(data.reserveCount);
        setReviewsCount(data.reviewCount);
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
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1em',
      }}
    >
      <div
        style={{
          padding: '1em',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ margin: '0 0.5em' }}>
          <div style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.6)' }}>Total Users</div>
          <h5
            style={{
              fontWeight: 'bold',
              margin: '0.5em 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{usersCount.toLocaleString()}</div>
            <span className="material-symbols-outlined" style={{ color: '#007bff' }}>
              account_circle
            </span>
          </h5>
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#007bff',
            marginTop: '1em',
          }}
        />
      </div>
      <div
        style={{
          padding: '1em',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ margin: '0 0.5em' }}>
          <div style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.6)' }}>Total Lodgings</div>

          <h5
            style={{
              fontWeight: 'bold',
              margin: '0.5em 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{lodgingsCount.toLocaleString()}</div>
            <span className="material-symbols-outlined" style={{ color: '#DC6748' }}>
              house
            </span>
          </h5>
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#DC6748',
            marginTop: '1em',
          }}
        />
      </div>
      <div
        style={{
          padding: '1em',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ margin: '0 0.5em' }}>
          <div style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.6)' }}>Total Rooms</div>
          <h5
            style={{
              fontWeight: 'bold',
              margin: '0.5em 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{roomsCount.toLocaleString()}</div>
            <span className="material-symbols-outlined" style={{ color: '#1AD993' }}>
              bed
            </span>
          </h5>
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#1AD993',
            marginTop: '1em',
          }}
        />
      </div>
      <div
        style={{
          padding: '1em',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ margin: '0 0.5em' }}>
          <div style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.6)' }}>Total Reservations</div>
          <h5
            style={{
              fontWeight: 'bold',
              margin: '0.5em 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{reservesCount.toLocaleString()}</div>
            <span className="material-symbols-outlined" style={{ color: '#9044F4' }}>calendar_month</span>
          </h5>
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#9044F4',
            marginTop: '1em',
          }}
        />
      </div>
      <div
        style={{
          padding: '1em',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ margin: '0 0.5em' }}>
          <div style={{ fontSize: '0.8em', color: 'rgba(0,0,0,0.6)' }}>Total Reviews</div>

          <h5
            style={{
              fontWeight: 'bold',
              margin: '0.5em 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>{reviewsCount.toLocaleString()}</div>
            <span className="material-symbols-outlined" style={{ color: '#F2A74B' }}>
              reviews
            </span>
          </h5>
        </div>
        <div
          style={{
            height: '4px',
            backgroundColor: '#F2A74B',
            marginTop: '1em',
          }}
        />
      </div>
    </div>
  );
}
