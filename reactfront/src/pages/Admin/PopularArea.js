import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Button1 } from '../../components/Button.style.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PopularArea() {
  const [areaData, setAreaData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null); // 선택된 지역
  const [chartData, setChartData] = useState(null); // 현재 차트 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/statistics/reservations-by-area');
        const data = await response.json();
        setAreaData(data);
      } catch (error) {
        console.error('Failed to fetch area data:', error);
        setError('Failed to load area data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // selectedMonth 또는 selectedArea가 변경될 때마다 차트 데이터 업데이트
  useEffect(() => {
    if (!selectedMonth) {
      setChartData(null);
      return;
    }

    const monthData = areaData.find((item) => item.month === selectedMonth);

    if (!monthData) {
      setChartData(null);
      return;
    }

    if (!selectedArea) {
      // 지역 데이터 표시
      const areaLabels = monthData.popularAreas.map((area) => area.area);
      const areaCounts = monthData.popularAreas.map((area) => area.totalCount);

      setChartData({
        labels: areaLabels,
        datasets: [
          {
            data: areaCounts,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF9FF0',
              '#A9A9A9',
              '#800000',
              '#008000',
            ],
            hoverOffset: 4,
          },
        ],
      });
    } else {
      // 시군구 데이터 표시
      const areaInfo = monthData.popularAreas.find((area) => area.area === selectedArea);

      if (!areaInfo || !areaInfo.popularSigungus) {
        setChartData(null);
        return;
      }

      const sigunguLabels = areaInfo.popularSigungus.map((sigungu) => sigungu.sigungu);
      const sigunguCounts = areaInfo.popularSigungus.map((sigungu) => sigungu.count);

      setChartData({
        labels: sigunguLabels,
        datasets: [
          {
            data: sigunguCounts,
            backgroundColor: [
              '#4E79A7',
              '#F28E2B',
              '#E15759',
              '#76B7B2',
              '#59A14F',
              '#EDC948',
              '#B07AA1',
              '#FF9DA7',
              '#9C755F',
              '#BAB0AC',
            ],
            hoverOffset: 4,
          },
        ],
      });
    }
  }, [selectedMonth, selectedArea, areaData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // 차트 옵션
  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
    cutout: '60%', // 도넛 차트의 굵기를 얇게 설정
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;

        if (!selectedArea) {
          // 지역을 클릭한 경우
          const monthData = areaData.find((item) => item.month === selectedMonth);
          if (monthData) {
            const areaName = monthData.popularAreas[index].area;
            setSelectedArea(areaName); // 선택된 지역 설정
          }
        } else {
          // 시군구를 클릭한 경우 추가 기능 구현 가능
        }
      } else {
        // 차트 외부 클릭 시 시군구 선택 해제
        if (selectedArea) {
          setSelectedArea(null);
        }
      }
    },
  };

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
      <div>인기 지역</div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 8fr', marginTop: '1em', height: '90%' }}
      >
        <div>
          <div style={{ display: 'grid', height: '100%' }}>
            {areaData.map((item) => (
              <Button1
                key={item.month}
                onClick={() => {
                  setSelectedMonth(item.month);
                  setSelectedArea(null); // 새로운 월 선택 시 지역 선택 해제
                }}
                style={{
                  fontFamily: 'pretendard-light',
                  fontSize: '0.7em',
                  padding: '1px',
                  borderColor: selectedMonth === item.month ? '#097ce6' : '#ccc',
                  marginBottom: '0.2em',
                }}
              >
                {item.month}월
              </Button1>
            ))}
            {selectedArea && (
              <Button1
                onClick={() => {
                  setSelectedArea(null); // 지역 데이터로 돌아가기
                }}
                style={{
                  fontFamily: 'pretendard-light',
                  fontSize: '0.7em',
                  padding: '2px',
                  borderColor: '#ccc',
                }}
              >
                뒤로가기
              </Button1>
            )}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {chartData ? (
            <Doughnut data={chartData} options={pieOptions} />
          ) : (
            <p style={{ textAlign: 'center', color: 'red', fontSize: '0.9em' }}>
              월을 선택하여 해당 월의 인기 지역을 확인하세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopularArea;
