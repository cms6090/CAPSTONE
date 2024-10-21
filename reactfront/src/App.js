import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Default/Main';
import Login from './pages/Log/Login';
import Notice from './pages/Default/Notice';
import FAQ from './pages/Default/FAQ';
import './App.css';
import Signup from './pages/Log/Signup';
import ProfileInfo from './pages/Users/ProfileInfo';
import ProfileReserve from './pages/Users/ProfileReserve';
import ProfileSetting from './pages/Users/ProfileSetting';
import Accommodations from './pages/Default/Accommodations';
import Accommodation from './pages/Default/Accommodation';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reserve from './pages/Reserve';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminLodgings from './pages/Admin/AdminLodgings';
import AdminReserves from './pages/Admin/AdminReserves';
import AdminRooms from './pages/Admin/AdminRooms';
import Review from './pages/Users/Review';

function App() {
  return (
    <Router>
      <Header /> {/* 모든 페이지에 Header가 표시됩니다 */}
      <Routes>
        <Route path="/" element={<Main />} /> {/* 메인 페이지 */}
        <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
        <Route path="/signup" element={<Signup />} /> {/*회원가입 페이지 */}
        <Route path="/notices" element={<Notice />} /> {/* 안내 페이지*/}
        <Route path="/faq" element={<FAQ />} /> {/* 자주묻는질문 페이지*/}
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/accommodations/:id" element={<Accommodation />} />
        <Route path="/profile/reservations" element={<ProfileReserve />} />
        <Route path="/profile/info" element={<ProfileInfo />} />
        <Route path="/profile/setting" element={<ProfileSetting />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/review" element={<Review />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/lodgings" element={<AdminLodgings />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/reservations" element={<AdminReserves />} />
        {/* 필요한 다른 라우트 추가 */}
      </Routes>
      <Footer /> {/* 모든 페이지에 Footer가 표시됩니다 */}
    </Router>
  );
}

export default App;
