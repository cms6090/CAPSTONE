// src/components/EventSection.js
import React from 'react';

const EventSection = () => {
    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center mb-4">이벤트</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100">
                            <img src="event1.jpg" className="card-img-top" alt="Event 1" />
                            <div className="card-body text-center">
                                <p className="card-text">Busan Staycation Special</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100">
                            <img src="event2.jpg" className="card-img-top" alt="Event 2" />
                            <div className="card-body text-center">
                                <p className="card-text">October Jeju Discounts</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100">
                            <img src="event3.jpg" className="card-img-top" alt="Event 3" />
                            <div className="card-body text-center">
                                <p className="card-text">International Early Bird Deals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventSection;
