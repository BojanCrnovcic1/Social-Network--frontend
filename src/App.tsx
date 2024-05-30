import React, { useState } from 'react'
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import NavBar from './components/navBar/NavBar';
import LeftBar from './components/leftBar/LeftBar';
import RightBar from './components/rightBar/RightBar';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import { useAuth } from './context/AuthContext';


function App() {
  const { user } = useAuth();
  const [leftBarVisible, setLeftBarVisible] = useState(false);
  const [rightBarVisible, setRightBarVisible] = useState(false);
  
  const toggleLeftBar = () => {
    setLeftBarVisible(!leftBarVisible);
  };

  const toggleRightBar = () => {
    setRightBarVisible(!rightBarVisible);
  };

  const Layout  = () => {
    return (
      <div>
        <NavBar />
        <div className='section'>
          <button type='button' className='left-toggle' onClick={toggleLeftBar} >L</button>         
            <LeftBar visible={leftBarVisible}/>
          
          <div style={{flex: 6}}>
            <Outlet />
          </div>         
          <RightBar visible={rightBarVisible}/>
          <button type='button' className='right-toggle' onClick={toggleRightBar}>R</button>
        </div>
      </div>
    )
  }


  const ProtectedRoute: React.FC<({ children: React.ReactNode})> = ({ children }) => {
    if (!user) {
      return <Navigate to={'/login'} />
    }
    return children;
  } 
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>     
      ),
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element:<Registration />
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App