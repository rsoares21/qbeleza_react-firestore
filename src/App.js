import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('surveys');
    this.unsubscribe = null;
    this.state = {
      surveys: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const surveys = [];
    querySnapshot.forEach((doc) => {
      const { nome, descricao, ordem } = doc.data();
      surveys.push({
        key: doc.id,
        doc, // DocumentSnapshot
        nome,
        descricao,
        ordem,
      });
    });
    this.setState({
      surveys
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br/>
            <h3 class="panel-title">
              Votações Abertas
            </h3>
          </div>
          <div class="panel-body">

            <Link to="/create" class="btn btn-success">Incluir NOVA votação (ADM)</Link><br/><br/>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ordem</th>
                </tr>
              </thead>
              <tbody>
                {this.state.surveys.map(board =>
                  <tr>
                    <td><Link to={`/show/${board.key}`}>{board.nome}</Link></td>
                    <td>{board.descricao}</td>
                    <td><Link to={`/vote/${board.key}`} class="btn btn-success">Participar</Link><br/><br/></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
