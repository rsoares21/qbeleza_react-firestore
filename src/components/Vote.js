import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('surveys');
    this.unsubscribe = null;
    this.state = {
      board: {},
      key: '',
      votos: {}
    };

    this.participantes = []
    this.integrantes = []
    this.query = {}

  }

  componentDidMount() {
    alert(`1`)
    const ref = firebase.firestore().collection('surveys').doc(this.props.match.params.id);

    ref.get().then((doc) => {

      if (doc.exists) {

        this.participantes = doc.data().participantes

        this.setState({
          board: doc.data(),
          key: doc.id,
          isLoading: false
          //votos: votos
        });




      } else {
        console.log("No such document!");
      }
    });

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

  }

  onCollectionUpdate = (querySnapshot) => {
    //alert(`update`)
    const surveys = [];
    querySnapshot.forEach((doc) => {
      this.participantes = doc.data().participantes
      /*      const { nome, descricao, ordem } = doc.data();
            surveys.push({
              key: doc.id,
              doc, // DocumentSnapshot
              nome,
              descricao,
              ordem
            });
            */
    });
    this.setState({
      surveys
    });
  }

  handleClick(participante) {
    alert(`this is: ${participante.nome}`);
    //const ref2 = firebase.firestore().collection('votos').doc(votacao); WORKING
    //const votos = null

    const refVotos = firebase.firestore().collection("votos").where("survey", "==", this.state.key)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docVotos) {
        //this.state.votos = docVotos.data()
        alert(`doc encontrado : ${JSON.stringify(docVotos.data(), null, 4)}`)
        alert(`votos : ${JSON.stringify(this.state.votos, null, 4)}`)

        console.log(docVotos.id, " => ", docVotos.data());
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });



  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br />
            <h3 class="panel-title">
              {this.state.board.nome}
            </h3>
          </div>
          <div class="panel-body">
            <br />
            <dl>

              <img src={require('./images/teste.jpg')} width="661" height="346" />

              <dt>Descrição detalhada: this.state</dt>
              <dd>{JSON.stringify(this.state)}</dd>

              <dt>Em quem você deseja votar para sair do programa ? </dt>
              <br></br>


              {this.participantes.map(participante =>
                <tr height="50">


                  <button onClick={() => this.handleClick(participante)}>
                    B {JSON.stringify(this.state.votos)}
                  </button>


                  <td><Link to={`/vote/${participante.nome}`} class="btn btn-success"> Votar em {participante.nome} ({participante.votos})</Link> &nbsp;
                  </td>
                </tr>
              )}

            </dl>
            <br />
            <Link to="/" class="btn btn-info">Home</Link>&nbsp;
          </div>
        </div>
      </div>
    );
  }
}

export default Show;
