import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
import { ButtonToolbar } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import './mysass.scss';


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
      //'padding': '4px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'black'
    }

    const homeDiv1Left = {
      //'background-color': 'white',
      'position': 'relative',
      'width': '65%',
      'height': 100,
      'padding': '0px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'cyan',
      //'border-top-left-radius': '15px'
    }

    const homeDiv1Right = {
      //'background-color': 'green',
      'width': '35%',
      //'height': 100,
      //'padding': '0px',
      'border-style': 'solid',
      'border-width': '1px',
      'border-color': 'white'
    }

    const homeDiv2Left = {
      //'background-color': 'green',
      //'left':'0px',
      'width': '100%',
      'height': '100%',
      //'padding': '1px',
      //'border-style': 'solid',
      //'border-width': '4px',
      //'border-color': 'red'
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
      //'top': '10px',
      //'left': '20px',
      'background-color': 'magenta',
      'width': '100%',
      'height': '100%',
      //'padding-left': '0px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': '#d2c2ff',
    }

    const homeDiv3Right = {
      'background-color': 'yellow',
      'width': '100%',
      'position': 'relative',
      'top': '20px',
      //'height': 100,
      //'padding-left': '8px',
      //'padding-top': '12px',
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'grey',
      //'border-top-right-radius': '10px',
    }

    const homeDiv4Left = {
      //'position': 'relative',
      //'top': '-38px',
      'left': '15px',
      //'background-color': 'green',
      'width': '500px', // largura principal
      'display': 'flex',
      'height': '580px',
      //'padding-left': '1px',
      //'border-style': 'solid',
      //'border-width': '4px',
      //'border-color': 'white',
    }


    const homeBannerQuadrado = {
      //'background-color': 'red',
      'width': '336px',
      //'top': '20px',
      //'padding':'5px',
      //'height': 100,
      'padding-left': '42px',
      'padding-top': '62px',
      //'padding-bottom': '12px',
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
      'font-size': '20px',
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


      <div class="container" style={{ 'background-color': 'white', 'width': '100%', 'background': 'white' }}>

        <img src={require('./images/logo_enquetepop.png')} style={{ 'width': '500px', 'height': '0px', 'top': '1px' }} />

        <div class="row" style={{ 'padding-top': '0px', 'padding-left': '12px' }}>
          <div style={homeDiv1Left}>
            <img src={require('./images/logo_enquetepop.png')} style={{ 'background-color': 'white', 'width': '400px' }} />&nbsp;
          </div>
        </div>



        <div class="row">

          <div style={homeDiv4Left}>
            <div class="row" style={{ 'position': 'relative', 'left': '13px', 'top': '-40px' }}>
              <div class="column" style={{ 'padding-top': '1px', 'padding-left': '0px' }}>
                <div style={{ 'width': '500px', 'height': '250px', 'padding-top': '0px' }}>
                

                <div class="buttons" style={{'padding-top':'18px', 'padding-left':'12px', 'padding-bottom':'22px'}}>
                    <button class="fill">Noticias</button>
                    <button class="fill">Contato</button>
                    <button class="fill">Registrar</button>
                    <button class="fill">Login</button>

                </div>


                  <div class="row">
                    <div class="example-2 card">
                      <div class="wrapper">
                        <div class="header">
                        </div>
                        <div class="data">
                          <div class="content">
                            <span class="author">Enquete</span>
                            <h1 class="title"><a href="#">Quem será o sexto eliminado no BBB 20 ? Participe da votação !</a></h1>
                            <p class="text">O paredão da semana está formado com Guilherme, Pyong Lee e Giselly. Vote na enquete e descubra o eliminado da semana!</p>
                            <a href="#" class="button">Participar!</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                </div>

              </div>
            </div>
          </div>

          <div style={homeBannerQuadrado}>
            <center>
              <img src={require('./images/banner_quadrado.gif')} style={{ 'width': '336' }} />
            </center>
          </div>
        </div>




        <div class="row" style={{ 'width': '100%' }}>
          <center>

            <div style={{ 'position': 'relative', 'paddingTop': '20px', 'paddingBottom': '10px', 'width': '100%' }}>
              <center><img src={require('./images/banner_retangular_zorba.png')} style={{ 'width': '99%' }} /></center>
            </div>
          </center>
        </div>

        <div class="row" style={{ 'padding': '5px' }}>
          <div style={homeDiv2Left}>
            <center>
              <div class="row" style={{ 'position': 'relative', 'left': '0px', 'width': '100%' }}>
                <div class="column" style={{ 'padding-top': '4px', 'padding-left': '0px' }}>

                  <div class="cardX" style={{ 'width': '248px' }}>
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
                <div class="column" style={{ 'padding-top': '4px', 'padding-left': '0px' }}>
                  <div class="cardX" style={{ 'width': '248px' }}>
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
                <div class="column" style={{ 'padding-top': '4px', 'padding-left': '0px' }}>
                  <div class="cardX" style={{ 'width': '248px' }}>
                    <div class="hover01 columnHover">
                      <div>
                        <figure><img src={require('./images/capa_masterchefeprofissionais2019.jfif')} alt="Card image" style={{ 'width': '100%' }} /></figure>
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
                <div class="column" style={{ 'padding-top': '4px', 'padding-left': '0px' }}>
                  <div class="cardX" style={{ 'width': '248px' }}>
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

              </div>
            </center>
          </div>
        </div>






        &nbsp;&nbsp;&nbsp;&nbsp;
                <img src={require('./images/teste.jpg')} width="60" height="50"/>
                <a style={gradient3}>{this.state.board.nome}</a>


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



    );
  }
}

export default Vote;
