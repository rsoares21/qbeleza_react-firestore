import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
import { ButtonToolbar } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';

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


    const headStyle = {
      'background-color': '#fcfcfa',
      'width': '100%',
      'height': 126,
      'padding': '4px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeDiv1Left = {
      'background-color': 'black',
      'width': '60%',
      //'height': 100,
      'padding': '5px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'cyan',
      'border-top-left-radius': '15px'
    }

    const homeDiv1Right = {
      'background-color': 'white',
      'width': '40%',
      //'height': 100,
      'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'white'
    }

    const homeDiv2Left = {
      'background-color': 'white',
      'width': '65%',
      'height': '400px',
      'padding': '5px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'pink'
    }

    const homeDiv2Right = {
      'background-color': 'white',
      'width': '35%',
      //'height': 100,
      'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeDiv3Left = {
      //'background-color': 'red',
      'width': '75%',
      'height': '400px',
      'padding': '5px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeDiv3Right = {
      'background-color': '#bbb',
      'width': '25%',
      //'height': 100,
      'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeEnqueteSec1 = {
      'background-color': 'white',
      //'width': '100%',
      'height': '100%',
      'padding': '10px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black',
      'position': 'relative',
      'top': '50%',
      'transform': 'translateY(-50%)',
      'border-bottom-right-radius': '15px'

    }

    const adHome1 = {
      'background-color': 'white',
      //'width': '100%',
      //'height': '100%',
      'padding': '10px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'white',
      'position': 'relative',
      'top': '50%',
      'transform': 'translateY(-50%)'

    }

    const homeEnqueteSec2 = {
      //'background-color': 'cyan',
      'width': '100%',
      'height': '198px',
      'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const gradient3 = {
      'background': 'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
      'font-size': '80px',
      'color': 'black',
      '-webkit-text-fill-color':'transparent',
      '-webkit-background-clip': 'text',
      'filter': 'drop-shadow(0px 3px 2px rgba(0, 0,0, .1))',
      'font-family': 'Lobster',
      'margin-top': '-7rem'

    }

    //  <div class="container" style={{ 'background-color': '#fdcd3b' }}>

    return (


      <div class="container" style={{ 'background-color': 'white' }}>

        <hr></hr>


        <div class="row">
          <div style={homeDiv1Left}>
            <img src={require('./images/logo.png')} />
          </div>

          <div style={homeDiv1Right}>
            <div style={homeEnqueteSec1}>
              <center>
                <ButtonToolbar>
                  <Button variant="outline-success">Success</Button>
                  <Button variant="outline-warning">Warning</Button>
                  <Button variant="outline-danger">Danger</Button>
                  <Button variant="outline-info">Info</Button>
                  <Button variant="outline-dark">Dark</Button>
                </ButtonToolbar>


              </center>
            </div>

          </div>


        </div>








        <div class="row">

          <div style={homeDiv2Left}>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <img src={require('./images/capa_bbb20.jfif')} width="50" height="40" /> &nbsp;
                    <a style={gradient3}>{this.state.board.nome}</a>
                </h3>
              </div>

              <div class="panel-body">
                <dl>
                  <img src={require('./images/teste.jpg')} width="730" height="340" />
                </dl>

              </div>

            </div>

          </div>

          <div style={homeDiv2Right}>
            <div style={adHome1}>
              <center>
                <img src={require('./images/ad_336x280.jfif')} width="336" height="280" />
              </center>
            </div>

          </div>
        </div>
        <br></br>
        <div class="row">
          <div style={homeDiv3Left}>
            <dt>Descrição detalhada:</dt>
            <dd>{this.state.board.descricao}</dd>


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

          <div style={homeDiv3Right}>
            <h2>ARTIGOS</h2>
            <p>Some text..</p>
          </div>
        </div>






      </div>
    );
  }
}

export default Vote;
