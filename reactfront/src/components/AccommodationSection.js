// src/components/AccommodationSection.js
import React from 'react';

const AccommodationSection = () => {
    return (
        <section className="container py-5">
            <h2>인기 추천 숙소</h2>
            <div className="btn-group mb-4" role="group" aria-label="Filter buttons">
                <button type="button" className="btn btn-primary">전체</button>
                <button type="button" className="btn btn-outline-primary">모텔</button>
                <button type="button" className="btn btn-outline-primary">호텔·리조트</button>
                <button type="button" className="btn btn-outline-primary">펜션·풀빌라</button>
                <button type="button" className="btn btn-outline-primary">프리미엄 블랙</button>
                <button type="button" className="btn btn-outline-primary">캠핑·글램핑</button>
                <button type="button" className="btn btn-outline-primary">게하·한옥</button>
            </div>

            <div className="row g-4">
                {/* 각 숙소 카드 추가 */}
                <div className="col-md-3">
                    <div className="card h-100">
                        <img src="hotel1.jpg" className="card-img-top" alt="Hotel 1" />
                        <div className="card-body">
                            <h5 className="card-title">구월 호텔반월</h5>
                            <p className="card-text">인천터미널역 도보 14분<br />
                                <span className="text-warning">★ 9.5</span> | 10,454명 평가
                            </p>
                            <p className="text-danger">쿠폰 적용시 <strong>40,500원</strong></p>
                            <p className="text-muted text-decoration-line-through">45,000원</p>
                        </div>
                    </div>
                </div>
                {/* 나머지 숙소 카드 추가 */}
            </div>
        </section>
    );
};

export default AccommodationSection;
