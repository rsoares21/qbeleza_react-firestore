import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Vote extends Component {

  constructor(props) {
    super(props);
    this.refParticipantes = firebase.firestore().collection('participantes').where(this.props.match.params.id, '==', true)
    this.state = {
      board: {},
      key: '',
      participantes: [],
      totalVotos: 0
    };

  }

  componentDidMount() {

    //const ref2 = firebase.firestore().collection('participantes').where(this.props.match.params.id, '==', true)
    /*
    const ref2 = firebase.firestore().collection('participantes')
    let query = ref2.where(this.props.match.params.id, '==', true).get()
      .then(snapshot => {
        if (snapshot.empty) {
          alert('mount No matching documents.')
          return;
        }

        snapshot.forEach(doc => {
          //alert(` mount participante encontrado ${JSON.stringify(doc.data())}`)
          this.state.participantes.push(doc.data())
        });
      })
      .catch(err => {
        console.log(' mountError getting documents', err)
      });
*/

    const ref = firebase.firestore().collection('enquetes').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          board: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });

    this.unsubscribe = this.refParticipantes.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {

    //alert(`update`)
    const participantes = [];
    let totalVotos = 0

    //le o total de votos antes para saber calcular o percentual de cada um
    querySnapshot.forEach((doc) => {
      const { votos } = doc.data();
      totalVotos = totalVotos + votos
    });


    querySnapshot.forEach((doc) => {
      //alert(`update doc.data() : ${doc.id}`)
      const { nome, votos } = doc.data();
      let percentual = (votos / totalVotos) * 100
      participantes.push({
        nome: nome, votos: votos, id: doc.id, percentual: percentual
      });

      //totalVotos = totalVotos + votos

    });
    this.setState({
      participantes,
      totalVotos
    });
    //alert(`participantes : ${JSON.stringify(this.state.participantes)}`)


  }


  vote(id) {
    //alert(`vote ${id}`)

    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);

    // Document reference
    const participanteRef = db.collection('participantes').doc(id);

    // Update read count
    participanteRef.update({ votos: increment });


  }

  showTotalVotos() {
    alert(`total votes ${this.state.totalVotos}`)
  }


  delete(id) {
    firebase.firestore().collection('surveys').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
      this.props.history.push("/")
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }


  render() {


    /* Create two unequal columns that floats next to each other */
    const column = {
      float: 'right',
      padding: '10px',
      height: '300px', /* Should be removed. Only for demonstration */
    }

    const left = {
      width: '25%',
    }

    const right = {
      width: '75%',
    }

    /* Clear floats after the columns */
    const row: 'after' = {
      content: "",
      display: 'table',
      clear: 'both'
    }

    return (



      <div class="row">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br />
            <h3 class="panel-title">
              <img src={require('./images/capa_bbb20.jfif')} width="50" height="40" /> &nbsp;
              {this.state.board.nome}

            </h3>
          </div>

          <div class="panel-body">
            <br />
            <dl>
              <img src={require('./images/teste.jpg')} width="661" height="346" />

              <dt>Descrição detalhada:</dt>
              <dd>{this.state.board.descricao}</dd>
            </dl>


            {this.state.participantes.map(participante =>
              <tr height="50">
                <td>
                  <button onClick={this.vote.bind(this, participante.id)} class="btn btn-warning"><b>{participante.nome}</b> ({participante.votos}) {parseFloat(participante.percentual).toFixed(2)}%</button>
                </td>
              </tr>
            )}
            <dl>
              <dd><b>Total de Votos:</b> {this.state.totalVotos}</dd>
            </dl>

            <br />
            <Link to="/" class="btn btn-info">Voltar</Link>&nbsp;


          </div>

          ----------------------------------------


        </div>

        <div class="row">
          <div class="column left" style={{ 'background-color': 'red', 'width': '300px' }}>
            <h2>Column 1</h2>
            <p>Some text..</p>
          </div>
          {/* <div class="column right" style={{ 'background-color': '#bbb' }}>
            <h2>Column 2</h2>
            <p>Some text..</p>
            </div>*/}
        </div>

      </div>



    );
  }
}

export default Vote;
