// src/components/PopularDestinations.js
import React from 'react';

const PopularDestinations = () => {
    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center mb-4">국내 인기 여행지</h2>
                <div className="row g-4">
                    {/* 각 여행지 카드를 여기에 추가 */}
                    <div className="col-md-3">
                        <div className="card h-100">
                            <img src="jeju.jpg" className="card-img-top" alt="Jeju Island" />
                            <div className="card-body text-center">
                                <p className="card-text">Jeju Island</p>
                            </div>
                        </div>
                    </div>
                    {/* 나머지 인기 여행지 추가 */}
                </div>
                <h2 className="text-center mt-5 mb-4">해외 인기 여행지</h2>
                <div className="row g-4">
                    {/* 해외 인기 여행지 카드 추가 */}
                </div>
            </div>
        </section>
    );
};

export default PopularDestinations;
