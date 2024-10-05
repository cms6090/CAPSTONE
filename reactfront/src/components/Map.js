import React, { useEffect } from 'react';

export default function Map() {
  useEffect(() => {
    const { naver } = window;

    if (naver) {
      // 데이터 배열
      const locations = [
        {
          id: 129067,
          title: '죽도마을',
          part: '민박',
          area: '전북특별자치도',
          sigungu: '고창군',
          addr: '전북특별자치도 고창군 부안면 봉암리 683',
          minfee: '40000',
        },
        {
          id: 129068,
          title: '해리마을',
          part: '민박',
          area: '전북특별자치도',
          sigungu: '고창군',
          addr: '전북특별자치도 고창군 해리면 동호리',
          minfee: '30000',
        },
        {
          id: 129104,
          title: '장촌마을',
          part: '민박',
          area: '전라남도',
          sigungu: '여수시',
          addr: '전라남도 여수시 삼산면 서도리',
          minfee: '20000',
        },
        {
          id: 136039,
          title: '서울올림픽파크텔',
          part: '유스호스텔',
          area: '서울특별시',
          sigungu: '송파구',
          addr: '서울특별시 송파구 올림픽로 448',
          minfee: '50000',
        },
        {
          id: 136060,
          title: '소노휴 양평',
          part: '',
          area: '경기도',
          sigungu: '양평군',
          addr: '경기도 양평군 개군면 신내길7번길 55',
          minfee: '100000',
        },
      ];

      // 주소를 좌표로 변환하는 함수
      const geocodeAddress = (address) => {
        return new Promise((resolve, reject) => {
          naver.maps.Service.geocode({ address: address }, (status, response) => {
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
        zoom: 7, // 초기 줌 레벨
      });

      // 모든 마커의 위치를 기반으로 초기 중심 위치 설정
      const bounds = new naver.maps.LatLngBounds();

      // 모든 위치에 대해 금액 표시 및 hover 이벤트 등록
      const createPriceMarkers = async () => {
        for (const location of locations) {
          const address = location.addr;
          const formattedPrice = Number(location.minfee).toLocaleString() + '원';

          try {
            console.log('주소를 변환 중:', address); // 주소 변환 전 확인
            const position = await geocodeAddress(address); // 주소를 좌표로 변환
            console.log('변환된 위치:', position); // 변환된 위치 확인
            bounds.extend(position); // 마커의 위치를 경계에 추가

            const overlay = new naver.maps.Marker({
              map: map,
              position: position,
              title: address,
              icon: {
                content: `
                  <div style="position: relative; background-color: white; padding: 10px; border: 1px solid lightgray; border-radius: 10px; font-size: 0.8em; font-weight: 500; width: 100px; text-align: center; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                    <span class="price" style="cursor: pointer;">${formattedPrice}</span>
                    <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; 
                      border-left: 3px solid lightgray; 
                      border-right: 3px solid lightgray; 
                      border-top: 10px solid white;"></div>
                  </div>`,
                size: new naver.maps.Size(100, 50),
                anchor: new naver.maps.Point(50, 50),
              },
            });

            // hover 이벤트 등록
            const contentString = `
              <div style="padding: 10px; background-color: white; border-radius: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);">
                <h4 style="margin: 0; color: #333;">${location.title}</h4>
                <p style="margin: 5px 0; color: #666;">주소: ${address}</p>
                <p style="margin: 5px 0; color: #666;">요금: <strong>${formattedPrice}</strong></p>
                <p style="margin: 5px 0; color: #666;">구역: ${location.area}</p>
                <p style="margin: 5px 0; color: #666;">유형: ${location.part || "정보 없음"}</p>
                <button style="padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer;">자세히 보기</button>
              </div>
            `;

            const infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              backgroundColor: 'rgba(255,255,255,0)',
              borderWidth: 0,
              anchorSize: new naver.maps.Size(0, 0),
            });

            naver.maps.Event.addListener(overlay, 'mouseover', () => {
              const offsetPosition = new naver.maps.LatLng(position._lat + 0.5, position._lng);
              infoWindow.open(map, offsetPosition);
            });

            naver.maps.Event.addListener(overlay, 'mouseout', () => {
              infoWindow.close();
            });

            console.log('금액 표시:', overlay); // 금액 표시 확인
          } catch (error) {
            console.error('Error creating marker for', address, error);
          }
        }

        // 모든 마커가 보이도록 범위 조정
        map.fitBounds(bounds);
      };

      createPriceMarkers();
    } else {
      console.error('Naver Maps API가 로드되지 않았습니다.');
    }
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}
