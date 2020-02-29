import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('enquetes').orderBy('ordem', 'asc');

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
    const mainDivStyle = {
      //border: '5px solid',
      //width: '955px',
      //height: '368px'
    };

    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br />
            <h3 class="panel-title">
              ENQUETE POP <br></br><br></br>
            </h3>
          </div>
          <div class="panel-body">

            <div style={mainDivStyle}>

              <table>
                <tr>
                  <td rowspan="2"><img src={require('./components/images/capa_bbb20.jfif')} width="600" height="400" /></td>
                  <td><img src={require('./components/images/capa_feriascomoex.jfif')} width="500" height="200" /></td>
                </tr>
                <tr>
                  <td><img src={require('./components/images/capa_casadosartistas.jfif')} width="500" height="200" /></td>
                </tr>
              </table>

            </div>

            <table class="table table-stripe" border="5">
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
                    <td><Link to={`/vote/${board.key}`} class="btn btn-success">Participar</Link><br /><br /></td>
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
