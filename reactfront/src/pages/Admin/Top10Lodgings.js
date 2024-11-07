import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, Typography } from '@mui/material';

export default function Top10Lodgings() {
  const [lodgingData, setLodgingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/statistics/top-lodgings');
        const data = await response.json();

        // 데이터 확인용 콘솔 출력
        console.log('Top 10 Lodgings Data:', data);

        setLodgingData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data. Please try again.');
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
      }}
    >
      <div>인기 숙소</div>
      <Table sx={{ minWidth: 650 }} aria-label="Top 10 Lodgings Table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ paddingLeft: 0 }}>
              <strong>Lodging Name</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Area</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Sigungu</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Rating</strong>
            </TableCell>
            <TableCell sx={{ paddingRight: 0 }} align="right">
              <strong>Reservation Count</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lodgingData.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ paddingLeft: 0 }}>
                {row.lodgingName}
              </TableCell>
              <TableCell align="right">{row.area}</TableCell>
              <TableCell align="right">{row.sigungu}</TableCell>
              <TableCell align="right">{row.rating}</TableCell>
              <TableCell align="right" sx={{ paddingRight: 0 }}>
                {row.reservationCount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
