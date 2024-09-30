import React from "react";
import ArrowRight from '../assets/Arrowright.svg'; // 추가
import './Arrow.css';

function Arrowright({ onClick }) {
    return (
        <div className="arrowcontainer" onClick={onClick}>
            <img src={ArrowRight} alt="화살표" className="arrow" />
        </div>
    );
}

export default Arrowright;
