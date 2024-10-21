import React, { useEffect } from 'react';

export default function JustMap({ locations }) {
  useEffect(() => {
    const { naver } = window;

    if (naver) {
      // 주소를 좌표로 변환하는 함수 정의
      const geocodeAddress = (address) => {
        return new Promise((resolve, reject) => {
          naver.maps.Service.geocode({ address }, (status, response) => {
            if (status === naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
              const result = response.v2.addresses[0];
              const position = new naver.maps.LatLng(result.y, result.x);
              resolve(position);
            } else {
              console.error('주소 변환 실패:', status, response);
              reject('주소 변환 실패');
            }
          });
        });
      };

      // 초기 맵 설정
      const map = new naver.maps.Map('map', {
        zoom: 15, // 초기 줌 레벨 설정
        center: new naver.maps.LatLng(37.3595704, 127.105399), // 초기 중심 위치 설정
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL, // 줌 컨트롤 스타일 설정
          position: naver.maps.Position.TOP_RIGHT, // 줌 컨트롤 위치 설정
        },
      });

      // 주소를 좌표로 변환하고 마커 추가
      geocodeAddress(locations)
        .then((position) => {
          // 마커를 맵에 추가
          const marker = new naver.maps.Marker({
            position,
            map,
          });

          // 맵의 중심을 마커 위치로 이동
          map.setCenter(position);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Naver Maps API가 로드되지 않았습니다.');
    }
  }, [locations]); // locations props가 변경될 때마다 useEffect 실행

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}
