import React from 'react';
import './MainBottom.css'; // CSS 파일을 추가하여 스타일링

const regions = [
  '경기', '제주', '인천', '대구', '대전',
  '서울', '부산', '전북', '울산', '광주',
  '강원', '세종'
];

export default function MainBottom() {
  return (
    <section>
      <div className='Bottom-title'>국내 여행지</div>
      <article>
        <div className="region-grid">
          {regions.map((region) => (
            <div className="region-part" key={region}>
              <a href={`/accommodations?keyword=${region}`} className="region-link">
                <span>{region}</span>
              </a>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
