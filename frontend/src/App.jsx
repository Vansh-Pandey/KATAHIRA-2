import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"; // <-- add useLocation
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from "./components/Navbar";
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import { ToastContainer } from "react-toastify";
import { useAuthStore } from './store/useAuthStore';
import LearnKana from './pages/LearnKana';
import Courses from './pages/Courses';
import Games from './pages/Games';
import LearnKanji from './pages/LearnKanji';
import PracticeKana from './pages/PracticeKana';
import Support from './pages/Support';
import About from './pages/About';
import Contact from './pages/Contact';
import PracticeKanji from './pages/PracticeKanji';
import AiTutor from './pages/AiTutor';
import Profile from './pages/Profile';

function App() {
  const { authUser, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // <-- define location

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser === null && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [authUser, location.pathname]);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={authUser ? <Home /> : <Navigate to="/" />} />
        <Route path="/learn/kana" element={authUser ? <LearnKana /> : <Navigate to="/" />} />
        <Route path="/courses" element={authUser ? <Courses /> : <Navigate to="/" />} />
        <Route path="/games" element={authUser ? <Games /> : <Navigate to="/" />} />
        <Route path="/learn/kanji" element={authUser ? <LearnKanji /> : <Navigate to="/" />} />
        <Route path="/practice/kana" element={authUser ? <PracticeKana /> : <Navigate to="/" />} />
        <Route path="/support" element={authUser ? <Support /> : <Navigate to="/" />} />
        <Route path="/practice/kanji" element={authUser ? <PracticeKanji /> : <Navigate to="/" />} />
        <Route path="/ai-tutor" element={authUser ? <AiTutor /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/" />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        {/* <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/profile" element={<Profile/>}/> */}
        {/* <Route path="/home" element={<Home/>}/> */}
      </Routes>
    </div>
  )
}

export default App
