import { Usuario } from "../../../interfaces/Usuario";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../../../Global";
import './EditarUsuario.css';

function EditarPerfil() {
  
  const navigate = useNavigate();

  // Pegar informações do usuário logado
  const token = localStorage.getItem('usuario');
  const [usuario, setUsuario] = useState<Usuario>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

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
        setNome(data.nome);
        setEmail(data.email);
    })
    .catch(error => {
        console.error("Erro:", error);
    })

    if (!token) {
      alert('Você precisa estar logado para acessar essa página');
      navigate('/');
    }
  }, [token]);

  // Atualizar informações do usuário -> confirmando o campo de senha digitada com a senha do ususario
  const [senhaAtual, setSenhaAtual] = useState('');

  function salvarUsuario(e: any) {
    e.preventDefault();

    if (!senhaAtual) {
      alert('Por favor, digite sua senha atual');
      return;
    }

    if (senhaAtual != usuario?.senha) {
      alert('Senha atual incorreta');
      return
    }

    const usuarioAtualizado: Partial<Usuario> = {
      nome: nome,
      email: email,
    };

    fetch(`http://localhost:5136/sistema/usuario/atualizar/${usuario?.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioAtualizado),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar usuário');
        }
        return response.json();
    })
    .then( () => {
        alert('Usuário atualizado com sucesso');
        navigate('/usuario/perfil');
    })
    .catch(error => {
        console.error('Erro:', error);
    })
  }

  return (
    <div className="EditPerfil">
      <div className="edit-perfil-card">
        <div className="edit-perfil-title">
          <h1>EDITAR PERFIL</h1>
        </div>

        <div className="form-edit-card">
          <form onSubmit={salvarUsuario}>
            <label>
              Nome:
              <input
                value={nome}
                type="text"
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>
            <label>
              E-mail:
              <input
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Senha Atual:
              <input
                type="password"
                placeholder="Senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
            </label>
            <button type="submit">SALVAR</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;