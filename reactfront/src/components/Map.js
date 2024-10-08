import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

export default function Map({ locations }) {
  // locations props 추가
  useEffect(() => {
    const { naver } = window;

    if (naver) {
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
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      // 모든 마커의 위치를 기반으로 초기 중심 위치 설정
      const bounds = new naver.maps.LatLngBounds();

      // 모든 위치에 대해 금액 표시 및 hover 이벤트 등록
      const createPriceMarkers = async () => {
        for (const location of locations) {
          const address = location.addr;

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
                    <span class="price" style="cursor: pointer; background-color: white;">${location.minfee}</span>
                    <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; 
                      border-left: 3px solid lightgray; 
                      border-right: 3px solid lightgray; 
                      border-top: 10px solid white;"></div>
                  </div>`,
                anchor: new naver.maps.Point(50, 50),
              },
            });
            const defaultImage = 'https://via.placeholder.com/151'; // 대체 이미지 URL

            // JSX 형식으로 카드 내용 정의
            const cardContent = (
              <a href={`/accommodations/${location.contentid}`} style={{textDecoration:'none'}}>
                <div
                  key={location.contentid}
                  style={{
                    display: 'flex',
                    padding: '2%',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                  }}
                >
                  <img
                    src={location.firstimage || defaultImage}
                    style={{ width: '20%', borderRadius: '15px' }}
                    alt={location.title}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: '1 0 auto', padding: '10px' }}>
                      <h6 style={{ margin: 0 }}>{location.title}</h6>
                      <p style={{ margin: '5px 0', color: 'gray', fontSize: '0.7em' }}>
                        {location.part}
                      </p>
                      <p
                        style={{
                          margin: '5px 0',
                          color: 'gray',
                          fontSize: '0.8em',
                          fontWeight: '700',
                        }}
                      >
                        {location.addr}
                      </p>
                      <p
                        style={{ margin: '5px 0', color: 'gray', fontSize: '0.8em' }}
                      >{`${location.minfee}`}</p>
                    </div>
                  </div>
                </div>
              </a>
            );

            // JSX를 HTML 문자열로 변환
            const contentString = ReactDOMServer.renderToString(cardContent);

            const infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              backgroundColor: 'transparent',
              borderColor: 'none',
              borderWidth: 0,
              anchorSize: new naver.maps.Size(0, 0),
              pixelOffset: new naver.maps.Point(0, -10),
            });

            let isInfoWindowOpen = false; // InfoWindow 열림 상태

            naver.maps.Event.addListener(overlay, 'mouseover', () => {
              if (!isInfoWindowOpen) {
                infoWindow.open(map, overlay);
              }
            });

            naver.maps.Event.addListener(overlay, 'mouseout', () => {
              if (!isInfoWindowOpen) {
                infoWindow.close();
              }
            });

            naver.maps.Event.addListener(overlay, 'click', () => {
              if (isInfoWindowOpen) {
                infoWindow.close();
                isInfoWindowOpen = false;

                overlay.setIcon({
                  content: `
                    <div style="position: relative; background-color: white; padding: 10px; border: 1px solid lightgray; border-radius: 10px; font-size: 0.8em; font-weight: 500; width: 100px; text-align: center; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                      <span class="price" style="cursor: pointer; background-color: white;">${location.minfee}</span>
                      <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; 
                        border-left: 3px solid lightgray; 
                        border-right: 3px solid lightgray; 
                        border-top: 10px solid white;"></div>
                    </div>`,
                  size: new naver.maps.Size(100, 50),
                  anchor: new naver.maps.Point(50, 50),
                });
              } else {
                infoWindow.open(map, overlay);
                isInfoWindowOpen = true;

                overlay.setIcon({
                  content: `
                    <div style="position: relative; background-color: #097ce6; padding: 10px; border: none; border-radius: 10px; font-size: 0.8em; font-weight: 500; width: 100px; text-align: center; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);">
                      <span class="price" style="cursor: pointer; color: white;">${location.minfee}</span>
                      <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; 
                        border-left: 3px solid lightgray; 
                        border-right: 3px solid lightgray; 
                        border-top: 10px solid white;"></div>
                    </div>`,
                  size: new naver.maps.Size(100, 50),
                  anchor: new naver.maps.Point(50, 50),
                });
              }
            });
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
  }, [locations]); // locations props가 변경될 때마다 useEffect 실행

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}
