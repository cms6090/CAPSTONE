import React, {useState} from 'react';

import './AccommoComponent.css';
import { Box, Card, CardContent, CardMedia, Typography, Pagination } from '@mui/material';

export default function AccommoComponent() {
  const data = [
    {
      id: 129067,
      title: '죽도마을',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '김치마을',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '삼겹마을',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '한국',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '중국',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '일본',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '북한',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '미국',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '러시아',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '캐나다',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '하와이',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '제주도',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '삼각김밥',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '캘린더',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
    {
      id: 129067,
      title: '라면',
      part: '민박',
      area: '전북특별자치도',
      sigungu: '고창군',
      addr: '전북특별자치도 고창군 부안면 봉암리 683',
      tel: '',
      firstimage: '', // 이미지 URL이 비어 있음
      minfee: '40000',
    },
  ];

  const defaultImage = 'https://via.placeholder.com/151'; // 대체 이미지 URL
  const itemsPerPage = 5; // 페이지당 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

  // 페이지에 표시할 데이터 계산
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage); // 전체 페이지 수

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="accommo-component">
      {paginatedData.map((item) => (
        <Card
          key={item.id}
          sx={{
            display: 'flex',
            marginBottom: '16px',
            padding: '2% 0%',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderBottom: '1px solid rgb(231,231,231)',
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: '20%', borderRadius: '15px' }}
            image={item.firstimage || defaultImage} // 이미지가 없으면 대체 이미지 사용
            alt={item.title}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2">{item.part}</Typography>
              <Typography variant="body2">{`${item.area} ${item.sigungu}`}</Typography>
              <Typography variant="body2">{item.addr}</Typography>
              <Typography variant="body2">{`${item.minfee}원`}</Typography>
            </CardContent>
          </Box>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <Pagination
          count={totalPages} // 전체 페이지 수
          page={currentPage} // 현재 페이지
          onChange={handlePageChange} // 페이지 변경 핸들러
          color="primary" // 색상 설정
        />
      </Box>
    </div>
  );
}
