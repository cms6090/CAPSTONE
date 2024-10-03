// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import Navbar from './components/Navbar';
import SearchSection from './components/SearchSection';
import EventSection from './components/EventSection';
import PopularDestinations from './components/PopularDestinations';
import AccommodationSection from './components/AccommodationSection';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import


const App = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <Navbar />
                            <SearchSection />
                            <EventSection />
                            <PopularDestinations />
                            <AccommodationSection />
                            <Footer />
                        </div>
                    }
                />
                <Route
                    path="/signIn"
                    element={
                      <div>
                        <Navbar />
                        <SignIn />
                      </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
