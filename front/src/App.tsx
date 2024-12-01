import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import * as GlobalComponents from './components/global';
import * as UsuarioComponents from './components/usuario';

import * as DashboardComponents from './components/dashboard';
import * as EventoComponents from './components/evento';


import './App.css';

function App() {

  return (
    <BrowserRouter>
      <GlobalComponents.NavBar />
      <Routes>
        <Route path="/" element={<GlobalComponents.PaginaInicial />} />

        <Route path="/sistema/usuario/cadastrar" element={<UsuarioComponents.CadastroUsuario />} />
        <Route path="/sistema/usuario/login" element={<UsuarioComponents.LoginUsuario />} />
        <Route path="/sistema/usuario/perfil" element={<UsuarioComponents.InformacaoUsuario />} />
        <Route path="/sistema/usuario/editar" element={<UsuarioComponents.EditarUsuario />} />
        
        <Route path="/sistema/dashboard" element={<DashboardComponents.DashboardPage />} />

        <Route path="/sistema/eventos/listar" element={<EventoComponents.ListaEventos />} />
        <Route path="/sistema/eventos/meus-eventos" element={<EventoComponents.OrganizadorEventos />} />
        <Route path="/sistema/eventos/minhas-inscricoes" element={<EventoComponents.InscricaoEventos />} />
        
        <Route path="/sistema/evento/criar" element={<EventoComponents.CriarEvento />} />
        <Route path="/sistema/evento/editar/:id" element={<EventoComponents.EditarEvento />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;