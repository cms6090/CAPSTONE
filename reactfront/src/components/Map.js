import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

export default function Map({ locations }) {
  useEffect(() => {
    const { naver } = window;

    if (naver) {
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

      const map = new naver.maps.Map('map', {
        zoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      const bounds = new naver.maps.LatLngBounds();

      const createPriceMarkers = async () => {
        try {
          // 모든 주소를 병렬로 변환
          const positions = await Promise.all(
            locations.map((location) => geocodeAddress(location.addr)),
          );

          positions.forEach((position, index) => {
            const location = locations[index];
            bounds.extend(position);

            const overlay = new naver.maps.Marker({
              map: map,
              position: position,
              title: location.addr,
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

            const defaultImage = 'https://via.placeholder.com/151';
            const cardContent = (
              <a
                href={`/accommodations/${location.contentid}`}
                style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                <div
                  style={{
                    display: 'flex',
                    padding: '2%',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                  }}
                >
                  <img
                    src={location.firstimage || defaultImage}
                    style={{
                      height: '9em',
                      borderRadius: '15px',
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                    }}
                    alt={location.title}
                  />
                  <div>
                    <div style={{ flex: '1 0 auto', padding: '10px' }}>
                      <h6 style={{ margin: 0 }}>{location.title}</h6>
                      <p style={{ margin: '5px 0', color: 'gray', fontSize: '0.7em' }}>
                        {location.part}
                      </p>
                      <p
                        style={{
                          margin: '5px 5px 0 0',
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

            const contentString = ReactDOMServer.renderToString(cardContent);

            const infoWindow = new naver.maps.InfoWindow({
              content: contentString,
              backgroundColor: 'transparent',
              borderColor: 'none',
              borderWidth: 0,
              anchorSize: new naver.maps.Size(0, 0),
              pixelOffset: new naver.maps.Point(0, -10),
            });

            let isInfoWindowOpen = false;

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
          });

          // 모든 마커가 보이도록 범위 조정
          map.fitBounds(bounds);
        } catch (error) {
          console.error('Error creating markers:', error);
        }
      };

      createPriceMarkers();
    } else {
      console.error('Naver Maps API가 로드되지 않았습니다.');
    }
  }, [locations]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}
