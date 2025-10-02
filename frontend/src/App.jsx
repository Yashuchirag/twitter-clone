import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/sigup/SignUpPage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import ErrorBoundary from './pages/error/ErrorBoundary';

const ProtectedRoute = ({ children, authUser, isLoading }) => {
  if (isLoading) return <LoadingSpinner size='lg' />; // wait for auth check
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const {data:authUser, isLoading, isError, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user data");
        console.log("Auth user is here", data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    retry: false,
  });


  if (isLoading) return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner size='lg'/>
    </div>
  );



  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Common component */}
      {authUser && <Sidebar />}
      <ErrorBoundary>
        <Routes>
          <Route path='/' element={<ProtectedRoute authUser={authUser} isLoading={isLoading} children={<HomePage />} />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path='/notifications' element={<ProtectedRoute authUser={authUser} isLoading={isLoading} children={<NotificationPage />} />} />
          <Route path='/profile/:username' element={<ProtectedRoute authUser={authUser} isLoading={isLoading} children={<ProfilePage />} />} />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster />
      </ErrorBoundary>
    </div>
  )
}

export default App
