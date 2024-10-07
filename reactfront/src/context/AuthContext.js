// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Context 생성
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 JWT 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    }
  }, []);

  // 로그인 상태와 상태 업데이트 함수를 제공
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
