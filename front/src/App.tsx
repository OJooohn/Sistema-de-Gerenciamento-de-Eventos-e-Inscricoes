import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import InformacaoUsuario from './components/usuario/InformacaoUsuario';
import CadastroUsuario from './components/usuario/CadastroUsuario';
import EditarUsuario from './components/usuario/EditarUsuario';
import PaginaInicial from './components/global/PaginaInicial';
import LoginUsuario from './components/usuario/LoginUsuario';
import NavBar from './components/global/NavBar';
import './App.css';

function MainContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' && <PaginaInicial />}
    </>
  );
}

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <MainContent />
      <Routes>
        <Route path="/sistema/usuario/cadastrar" element={<CadastroUsuario />} />
        <Route path="/sistema/usuario/login" element={<LoginUsuario />} />
        <Route path="/sistema/usuario/perfil" element={<InformacaoUsuario />} />
        <Route path="/sistema/usuario/editar" element={<EditarUsuario />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;