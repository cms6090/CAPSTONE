// src/components/SearchSection.js
import React from 'react';

const SearchSection = () => {
    return (
        <section className="search-section py-5 text-white text-center" style={{ backgroundImage: "url('https://static.yeogi.com/_next/static/media/05_Kv_PC_Light.3deeaa46.webp')", backgroundSize: 'cover',  minHeight: '460px' }}>
            <div className="container">
                <h1 className="display-4">Find Your Dream Destination</h1>
                <div className="bg-white p-4 rounded shadow-sm mt-4">
                    <div className="d-flex justify-content-center mb-3">
                        <button className="btn btn-primary me-2 active">국내 숙소</button>
                        <button className="btn btn-outline-primary">해외 숙소</button>
                    </div>
                    <form className="row g-2 justify-content-center">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="여행지나 숙소를 검색해보세요." />
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control" placeholder="Check-in" />
                        </div>
                        <div className="col-md-2">
                            <input type="date" className="form-control" placeholder="Check-out" />
                        </div>
                        <div className="col-md-2">
                            <select className="form-select">
                                <option>1 Guest</option>
                                <option>2 Guests</option>
                                {/* More options */}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SearchSection;
