import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('servicos');
    this.unsubscribe = null;
    this.state = {
      servicos: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const servicos = [];
    querySnapshot.forEach((doc) => {
      const { title, description, price } = doc.data();
      servicos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        price,
      });
    });
    this.setState({
      servicos
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
              Serviços de Beleza
            </h3>
          </div>
          <div class="panel-body">

            <Link to="/create" class="btn btn-success">Incluir novo serviço de beleza</Link><br/><br/>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição detalhada do serviço</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                {this.state.servicos.map(board =>
                  <tr>
                    <td><Link to={`/show/${board.key}`}>{board.title}</Link></td>
                    <td>{board.description}</td>
                    <td>R$ {board.price}</td>
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
