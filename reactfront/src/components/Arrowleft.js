import React from "react";
import ArrowLeft from '../assets/Arrowleft.svg';
import './Arrow.css';

function Arrowleft({ onClick }) {
    return (
        <div className="arrowcontainer" onClick={onClick}>
            <img src={ArrowLeft} alt="화살표" className="arrow" />
        </div>
    );
}

export default Arrowleft;
