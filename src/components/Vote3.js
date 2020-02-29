import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('participantes')
    this.enqueteRef = firebase.firestore().collection('enquetes').doc(this.props.match.params.id);
    this.unsubscribe = null;
    this.state = {
      board: {},
      key: ''
    };

    this.participantes = []

  }

  componentDidMount() {

    alert(`mount`)

    //const enqueteRef = firebase.firestore().collection('enquetes').doc(this.props.match.params.id);

    this.enqueteRef.get().then((docEnquete) => {

      if (docEnquete.exists) {

        alert(`mount enq exists : ${JSON.stringify(docEnquete.data())}`)

        this.setState({
          board: docEnquete.data(),
          key: docEnquete.id
        });

      } else {
        console.log("No such document!");
      }
    });


    //let participantesRef = firebase.firestore().collection('participantes')

    let query = this.ref.where(this.props.match.params.id, '==', true).get()
      .then(snapshot => {
        if (snapshot.empty) {
          alert('mount No matching documents.')
          return;
        }

        let participantes = []
        snapshot.forEach(doc => {
          alert(` mount participante encontrado ${JSON.stringify(doc.data())}`)
          participantes.push(doc.data())
        });
        this.participantes = participantes
      })
      .catch(err => {
        console.log(' mountError getting documents', err)
      });

    this.unsubscribe = this.enqueteRef.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {
    alert(`update :`)
    if (querySnapshot.empty) {
      alert('update : No matching documents.')
    } else {
      alert(`update : snapshot conteudo`)
    }
  }


  handleClick() {
    alert(`handleClick`);
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

              <dt>Descrição detalhada: </dt>
              <dd>{this.state.board.descricao}</dd>


              <dt>Em quem você deseja votar para sair do programa ? </dt>
              <br></br>

              {this.participantes.map(participante =>
                <tr height="50">
                  a
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
