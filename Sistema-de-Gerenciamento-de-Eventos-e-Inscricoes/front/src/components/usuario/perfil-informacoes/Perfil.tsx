import React, { useEffect, useState } from "react";
import { Usuario } from "../../../interfaces/Usuario";
import Global from "../../../Global";
import { Link, useNavigate } from "react-router-dom";
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState<Usuario>();

  const token = localStorage.getItem('usuario');

  const navigate = useNavigate();

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

    if (!token) {
      alert('Você precisa estar logado para acessar essa página');
      navigate('/');
    }
  })

  function removeUser() {
    fetch(`http://localhost:5136/sistema/usuario/deletar/${usuario?.id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao remover usuário");
      }
      return response.json();
    })
    .then(data => {
      alert('Usuário removido com sucesso');
      localStorage.removeItem('usuario');
      navigate('/');
    })
    .catch(error => {
      console.error("Erro:", error);
    })
  }

  return (
    <div className="perfil">
      <div className="card-perfil">

        <div className="card-perfil-title">
          <h1>Perfil</h1>
        </div> 

        <div className="table-card">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th colSpan={2}>Informações do Perfil</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nome:</strong></td>
                  <td>{usuario?.nome}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{usuario?.email}</td>
                </tr>
                <tr>
                  <td><strong>Perfil:</strong></td>
                  <td>{usuario?.perfil}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        
        <div className="perfil-controls">
          <button
            onClick={() => {
              localStorage.removeItem("usuario");
              navigate("/");
            }}
          >
            Sair
          </button>
          
          {usuario?.perfil === "Organizador" && (
            <>
              <Link to="/evento/meus-eventos">
                <button>MEUS EVENTOS</button>
              </Link>
              <Link to="/evento/inscritos">
                <button>EVENTOS INSCRITOS</button>
              </Link>
            </>
          )}

          {usuario?.perfil !== "Organizador" && (
            <Link to="/evento/inscritos">
              <button>EVENTOS INSCRITOS</button>
            </Link>
          )}

          <Link to="/usuario/editar">
            <button>EDITAR PERFIL</button>
          </Link>

          <button onClick={removeUser}>Remover Perfil</button>
        </div>

      </div>
    </div>
  );
}

export default Perfil;