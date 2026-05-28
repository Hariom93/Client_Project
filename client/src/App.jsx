import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Matrimony from './pages/Matrimony';
import Businesses from './pages/Businesses';
import Scholarships from './pages/Scholarships';
import Events from './pages/Events';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Donations from './pages/Donations';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/members" element={<PageTransition><Members /></PageTransition>} />
        <Route path="/matrimony" element={<PageTransition><Matrimony /></PageTransition>} />
        <Route path="/business" element={<PageTransition><Businesses /></PageTransition>} />
        <Route path="/scholarship" element={<PageTransition><Scholarships /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/news" element={<PageTransition><News /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/donations" element={<PageTransition><Donations /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <PageTransition>
                <Admin />
              </PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { toast } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        {toast && (
          <div className={`toast toast-${toast.type}`} role="alert">
            {toast.message}
          </div>
        )}

        <main className="main-content">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

