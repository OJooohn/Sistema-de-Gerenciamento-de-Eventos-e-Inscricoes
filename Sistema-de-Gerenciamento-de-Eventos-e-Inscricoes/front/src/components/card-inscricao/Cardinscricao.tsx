import './Cardinscricao.css';

function Cardinscricao() {
    return (
      <div className="cardinscricao">
        <div className="card">
          <div className="left-side-card">
            <h1>CRIE SEU EVENTO</h1>
            <p>Para criar um evento, clique no botão ao lado!</p>
          </div>
          <div className="right-side-card">
            <button className="btn-card">Criar Evento</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Cardinscricao;