import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Login from './pages/Login';
import Notice from './pages/Notice';
import FAQ from './pages/FAQ';
import './App.css';
import COMPONENTTEST from './pages/COMPONENTTEST'
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Header /> {/* 모든 페이지에 Header가 표시됩니다 */}
      <Routes>
        <Route path="/" element={<Main />} /> {/* 메인 페이지 */}
        <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
        <Route path="/notices" element={<Notice />} /> {/* 안내 페이지*/} 
        <Route path="/faq" element={<FAQ />} /> {/* 자주묻는질문 페이지*/} 
        <Route path="/componenettest" element={<COMPONENTTEST/>}/>
        <Route path="/signup" element={<Signup/>}/>


        {/* 필요한 다른 라우트 추가 */}
      </Routes>
      <Footer /> {/* 모든 페이지에 Footer가 표시됩니다 */}
    </Router>
  );
}

export default App;