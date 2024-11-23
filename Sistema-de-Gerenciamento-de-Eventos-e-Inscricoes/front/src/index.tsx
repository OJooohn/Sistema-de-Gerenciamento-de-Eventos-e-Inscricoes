import EventosDashboard from './components/eventos/eventos-dashboard/EventosDashboard';
import EventosInscritos from './components/eventos/eventos-inscritos/EventosInscritos';
import EditarPerfil from './components/usuario/editar-usuario/EditarUsuario';
import EditarEvento from './components/eventos/editar-evento/EditarEvento';
import CriarEvento from './components/eventos/criar-evento/CriarEvento';
import MeusEventos from './components/eventos/meus-eventos/MeusEventos';
import Perfil from './components/usuario/perfil-informacoes/Perfil';
import Signup from './components/usuario/signup/signup';
import Login from './components/usuario/login/login';
import Home from './components/home/Home';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

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
        path: '/usuario/signup',
        element: <Signup />
      },
      {
        path: '/usuario/perfil',
        element: <Perfil />
      },
      {
        path: '/usuario/login',
        element: <Login />
      },
      {
        path: '/usuario/editar',
        element: <EditarPerfil />
      },
      {
        path: '/evento/criar',
        element: <CriarEvento />
      },
      {
        path: '/evento/inscrever',
        element: <EventosDashboard />
      },
      {
        path: '/evento/meus-eventos',
        element: <MeusEventos />
      },
      {
        path: '/evento/inscritos',
        element: <EventosInscritos />
      },
      {
        path: '/evento/editar/:id',
        element: <EditarEvento />
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
