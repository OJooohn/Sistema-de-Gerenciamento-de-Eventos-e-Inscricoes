import React, { useEffect, useState } from "react";
import { Usuario } from "../../interfaces/Usuario";
import Global from "../../Global";
import { useNavigate } from "react-router-dom";

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
    <div className="Perfil">
      <h1>Perfil</h1>
      <h2>Nome: {usuario?.nome}</h2>
      <h2>Email: {usuario?.email}</h2>
      <h2>Perfil: {usuario?.perfil}</h2>

      <button onClick={() => {
        localStorage.removeItem('usuario');
        navigate('/')
      }}>Sair</button>

      <button>Editar Perfil</button>
      <button onClick={removeUser}> Remover Perfil</button>
    </div>
  );
}

export default Perfil;