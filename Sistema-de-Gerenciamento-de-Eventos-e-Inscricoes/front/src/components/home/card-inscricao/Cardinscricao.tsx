import { Usuario } from '../../../interfaces/Usuario';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Global from '../../../Global';
import './Cardinscricao.css';

function Cardinscricao() {
  const navigate = useNavigate();

  // Pegar informações do usuário logado
  const [usuario, setUsuario] = useState<Usuario>();
  const token = localStorage.getItem('usuario');

  useEffect(() => {
      fetch(`http://localhost:5136/sistema/usuario/buscar/${token}`)
      .then(response => {
          if (!response.ok) {
              console.log(Global.usuario);
              throw new Error("Erro ao obter usuário");
          }
          return response.json();

      })
      .then(data => {
          setUsuario(data);
      })
      .catch(error => {
          console.error("Erro:", error);
      })
  })

  // Função para ir na página de criar evento
  const handleCriarEvento = () => {
    if (!usuario) {
      alert('Você precisa estar logado para acessar essa página');
      navigate('/usuario/login');
    } else {
      navigate('/evento/criar');
    }
  };

  // Função para ir na página de inscrever evento
  const handleInscreverEvento = () => {
    if (!usuario) {
      alert('Você precisa estar logado para acessar essa página');
      navigate('/usuario/login');
    } else {
      navigate('/evento/inscrever');
    }
  };

  if(!usuario) {
    return(
      <div className="cardinscricao">
      <div className="card-inscricao">
        <div className="left-side-card">
          <h1>CRIE SEU EVENTO</h1>
          <p>Para criar um evento, clique no botão ao lado!</p>
        </div>
        <div className="right-side-card">
          <button className="btn-card" onClick={handleCriarEvento}>
            CRIAR EVENTO
          </button>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="cardinscricao">
      <div className="card-inscricao">
        <div className="left-side-card">
          <h1>CRIE SEU EVENTO</h1>
          <p>Para criar um evento, clique no botão ao lado!</p>
        </div>
        <div className="right-side-card">
          {usuario?.perfil === 'Organizador' && (
            <button className="btn-card" onClick={handleCriarEvento}>
              CRIAR EVENTO
            </button>
          )}
          <button className="btn-card" onClick={handleInscreverEvento}>
            EVENTOS
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cardinscricao;