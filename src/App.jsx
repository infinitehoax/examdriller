// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import './pages/Practice.css';
import './pages/Classroom.css';

import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import PracticeExam from './pages/PracticeExam';
import PracticeResult from './pages/PracticeResult';
import Classroom from './pages/Classroom';
import QuestionSearch from './pages/QuestionSearch';
import Bookmarks from './pages/Bookmarks';
import ResultHistory from './pages/ResultHistory';
import PerformanceAnalysis from './pages/PerformanceAnalysis';
import StudyPlan from './pages/StudyPlan';
import ScienceNote from './pages/ScienceNote';
import Dictionary from './pages/Dictionary';
import Literature from './pages/Literature';
import ExaminersReport from './pages/ExaminersReport';
import Challenge from './pages/Challenge';
import Leaderboard from './pages/Leaderboard';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import AiTutor from './pages/AiTutor';
import Games from './pages/Games';
import MathRush from './pages/games/MathRush';
import FameGame from './pages/games/FameGame';
import MillionaireGame from './pages/games/MillionaireGame';
import MapGame from './pages/games/MapGame';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/exam" element={<PracticeExam />} />
        <Route path="/practice/result" element={<PracticeResult />} />

        <Route path="/classroom" element={<Classroom />} />
        <Route path="/search" element={<QuestionSearch />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/history" element={<ResultHistory />} />
        <Route path="/analysis" element={<PerformanceAnalysis />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/science-note" element={<ScienceNote />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/literature" element={<Literature />} />
        <Route path="/examiners" element={<ExaminersReport />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-tutor" element={<AiTutor />} />

        <Route path="/games" element={<Games />} />
        <Route path="/games/math-rush" element={<MathRush />} />
        <Route path="/games/fame" element={<FameGame />} />
        <Route path="/games/millionaire" element={<MillionaireGame />} />
        <Route path="/games/map" element={<MapGame />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
