import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
import { ButtonToolbar } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { MDBMask, MDBView, MDBContainer, MDBRow, MDBCol } from "mdbreact";

import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdbreact';

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
      //'background-color': 'white',
      'width': '65%',
      'height': 100,
      'padding': '5px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'cyan',
      //'border-top-left-radius': '15px'
    }

    const homeDiv1Right = {
      'background-color': 'green',
      'width': '35%',
      //'height': 100,
      'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'white'
    }

    const homeDiv2Left = {
      'background-color': 'white',
      'width': '100%',
      'height': '100%',
      'padding': '1px',
      'border-style': 'solid',
      'border-width': '4px',
      'border-color': 'red'
    }

    const homeDiv2Right = {
      'position': 'relative',
      'background-color': 'red',
      'width': '32%',
      //'height': 100,
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeDiv3Left = {
      'position': 'relative',
      'top': '20px',
      'background-color': '#ebebeb',
      'width': '68%',
      'height': '100%',
      'padding-left': '1px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': '#d2c2ff',
    }

    const homeDiv3Right = {
      'background-color': 'white',
      'width': '32%',
      'position': 'relative',
      'top': '20px',
      //'height': 100,
      'padding-left': '8px',
      'padding-top': '12px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'grey',
      //'border-top-right-radius': '10px',
    }

    const homeDiv4Left = {
      'position': 'relative',
      'top': '8px',
      'left':'5px',
      'background-color': 'white',
      'width': '700px',
      'height': '300PX',
      'padding-left': '1px',
      'border-style': 'solid',
      'border-width': '4px',
      'border-color': 'white',
    }


    const homeBannerQuadrado = {
      //'background-color': 'red',
      'width': '30%',
      'top': '20px',
      'padding':'5px',
      //'height': 100,
      'padding-left': '8px',
      'padding-top': '12px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'grey',
      //'border-top-right-radius': '10px',
    }

    const homeEnqueteSec1 = {
      'background-color': 'cyan',
      //'width': '100%',
      'height': '100%',
      'padding': '10px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'cyan',
      //'border-top-left-radius': '15px',
      'position': 'relative',
      'top': '50%',
      'transform': 'translateY(-50%)',
      //'border-bottom-right-radius': '19px'

    }

    const adHome1 = {
      'background-color': 'white',
      'width': '100%',
      //'height': '100%',
      'padding': '2px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'white',
      'position': 'relative',

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
      //'background': 'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
      'background': 'linear-gradient(19deg, #384fff 0%, #f56c6c 100%)',
      'font-size': '30px',
      'font-weight': 'bold',
      'color': 'black',
      '-webkit-text-fill-color': 'transparent',
      '-webkit-background-clip': 'text',
      'filter': 'drop-shadow(0px 3px 2px rgba(0, 0,0, .1))',
      'font-family': 'monospace',
      'margin-top': '-7rem '

    }

    const homeDivMain = {
      'background-color': 'yellow',
      'width': '700px',
      'position': 'relative',
      'top': '20px',
      //'height': 100,
      'padding-left': '8px',
      'padding-top': '12px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'grey',
      //'border-top-right-radius': '10px',
    }


    const textoCard = {
      'color': 'orange'
    }

    


    //  <div class="container" style={{ 'background-color': '#fdcd3b' }}>

    return (


      <div class="container" style={{ 'background-color': 'white', 'width':'1050px', 'background':'white'}}>



        <div class="row" style={{ 'padding-top': '20px','padding-left': '30px' }}>
          <div style={homeDiv1Left}>
            <img src={require('./images/logo_enquetepop.png')} />
          </div>
        </div>



        <div class="row">

          <div style={homeDiv4Left}>
            <div class="row" style={{ 'position': 'relative', 'left': '13px' }}>
              <div class="column" style={{ 'padding': '1px' }}>
                <img src={require('./images/teste.jpg')} width="50" height="40" /> &nbsp;
                    <a style={gradient3}>{this.state.board.nome}</a>
              </div>
              <div>
                <br></br>
                <div class="icon-cards">
	<div class="icon-cards__content">
		<div class="icon-cards__item"></div>
		<div class="icon-cards__item"></div>
		<div class="icon-cards__item"></div>
		<div class="icon-cards__item"></div>
		<div class="icon-cards__item"></div>
	</div>
</div>

              </div>

            </div>
          </div>

          <div style={homeBannerQuadrado}>
            <center>
              <img src={require('./images/banner_quadrado.gif')} />
            </center>
          </div>
        </div>



        <div class="row" style={{ 'position': 'relative', 'top': '20px' }}>
          <div style={{ 'position': 'relative', 'paddingTop': '20px', 'paddingBottom': '20px', 'width': '100%' }}>
            <center><img src={require('./images/banner_retangular_zorba.png')} /></center>
          </div>

        </div>

        <div class="row">

          <div style={homeDiv3Left}>
            <div class="row" style={{ 'position': 'relative', 'left': '13px' }}>
              <div class="column" style={{ 'padding': '0px' }}>
                <div class="card" style={{ 'width': '238px' }}>
                  <div class="hover01 columnHover">
                    <div>
                      <figure><img src={require('./images/capa_thecirclebrasil.jfif')} alt="Card image" style={{ 'width': '100%' }} /></figure>
                    </div>
                  </div>

                  <div class="card-body">
                    <h5>The Circle Brasil</h5>
                    <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
                    <ButtonToolbar>
                      <Button variant="primary">Participar</Button>
                    </ButtonToolbar>

                  </div>
                </div>
              </div>
              <div class="column" style={{ 'padding': '0px' }}>
                <div class="card" style={{ 'width': '238px' }}>
                  <div class="hover01 columnHover">
                    <div>
                      <figure><img src={require('./images/capa_feriascomoex.jfif')} alt="Card image" style={{ 'width': '100%' }} /></figure>
                    </div>
                  </div>


                  <div class="card-body">
                    <h5>De Férias com o Ex</h5>
                    <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
                    <ButtonToolbar>
                      <Button variant="primary">Participar</Button>
                    </ButtonToolbar>

                  </div>
                </div>
              </div>
              <div class="column" style={{ 'padding': '0px' }}>
                <div class="card" style={{ 'width': '238px' }}>
                  <div class="hover01 columnHover">
                    <div>
                      <figure><img src={require('./images/capa_masterchefeprofissionais2019.jfif')} alt="Card image" style={{ 'width': '100%' }} /></figure>
                    </div>
                  </div>

                  <div class="card-body">
                    <h5>Masterchef Profissionais 2019</h5>
                    <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
                    <ButtonToolbar>
                      <Button variant="primary">Participar</Button>
                    </ButtonToolbar>

                  </div>
                </div>
              </div>

            </div>
          </div>



          <div style={homeDiv3Right}>
            <h5 >Big Brother Brasil</h5>
            <a href="#"> Brothers </a>se reúnem para as compras da Xepa no Mercado BBB
            <hr></hr>
            <h5 >De Férias com o Ex</h5>
            <a href="#"> Miguel e Maurício </a>brigam por <a href="#">causa</a> de Fernanda

          </div>
        </div>

        <div class="row">
          <div style={homeDiv2Left}>
            <br></br>
            <br></br>
            <br></br>



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
        </div>





      </div>



    );
  }
}

export default Vote;
