// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation(); // 현재 URL 가져오기
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
        }
    }, []);

    // 로그아웃 함수
    const handleLogout = () => {
        localStorage.removeItem('token'); // 토큰 삭제
        setIsLoggedIn(false);  // 로그인 상태 해제
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Site Logo" width="150" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        {!isLoggedIn ? (  // 로그인되지 않은 경우
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to={`/signIn?redirectUri=${encodeURIComponent(location.pathname)}`} // 로그인 링크에 redirectUri 추가
                                    >
                                        로그인
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signUp">회원가입</Link>
                                </li>
                            </>
                        ) : (  // 로그인된 경우
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>로그아웃</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
