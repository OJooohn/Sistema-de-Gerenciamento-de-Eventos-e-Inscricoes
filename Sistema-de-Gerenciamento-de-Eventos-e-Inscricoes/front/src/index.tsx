import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Home from './components/home/Home';
import Signup from './components/signup/signup';
import App from './App';
import Perfil from './components/perfil/Perfil';
import Login from './components/login/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/perfil',
        element: <Perfil />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
]);

localStorage.setItem('token', '');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
