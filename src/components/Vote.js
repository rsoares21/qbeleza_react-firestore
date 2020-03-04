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
    this.CardsEnquetes = firebase.firestore().collection('enquetes').where('ativo', '==', true)
    this.state = {
      board: {},
      key: '',
      participantes: [],
      enquetes: [],
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
    this.unsubscribe = this.CardsEnquetes.onSnapshot(this.onCollectionUpdateCardsEnquetes);
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

  onCollectionUpdateCardsEnquetes = (querySnapshot) => {

    //alert(`update`)
    const enquetes = [];
    //let totalVotos = 0

    //le o total de votos antes para saber calcular o percentual de cada um
    //querySnapshot.forEach((doc) => {
    //alert(JSON.stringify(doc.data()))
    //const { enquete } = doc.data();
    //totalVotos = totalVotos + votos
    //});


    querySnapshot.forEach((doc) => {
      //alert(`update doc.data() : ${doc.id}`)
      const { nome, descricao, capa, ordem } = doc.data();
      //let percentual = (votos / totalVotos) * 100
      enquetes.push({
        nome: nome, descricao: descricao, capa: capa,  ordem: ordem, id: doc.id
      });

      //totalVotos = totalVotos + votos

    });
    this.setState({
      enquetes,
      //totalVotos
    });
    //alert(`enquetes : ${JSON.stringify(this.state.enquetes)}`)

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
      //'border-style': 'solid',
      //'border-width': '1px',
      //'border-color': 'black'
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
      //'border-style': 'solid',
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
      'border-style': 'solid',
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
      'border-style': 'solid',
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

    const footerStyle = {
      'background': '#4343d8',
      //'position': 'relative',
      //'border-style': 'solid', //guia
      'border-color': 'green',
      'font-size': '20px',
      //'font-family': "monospace",
      //'font-family': "Georgia",
      'font-family': "Tahoma",
      //'font-family': "Lucida Console",
      //'font-weight': 'bold',
      //'color': '#6c3bd6',
      'color': '#4343d8',

      'text-align': 'center',
      'width': '100%',
      'height': '130px',
      'paddingTop': '30px'

    }


    //  <div class="container" style={{ 'background-color': '#fdcd3b' }}>

    return (


      <div class="container" style={{ 'background-color': 'white', 'width': '1050px', 'background': 'white' }}>

        <img src={require('./images/logo_enquetepop.png')} style={{ 'width': '500px', 'height': '0px', 'top': '1px' }} />

        <div class="row" style={{ 'padding-top': '0px', 'padding-left': '12px' }}>
          
          <div style={homeDiv1Left}>
            <img src={require('./images/logo_enquetepop.png')} style={{ 'background-color': 'white', 'width': '400px' }} />&nbsp;
          </div>
        </div>



        <div class="row">

          <div style={homeDiv4Left}>
            <div class="row" style={{ 'position': 'relative', 'left': '13px', 'top': '-40px' }}>
              <div class="column" style={{ 'padding-top': '1px', 'padding-left': '0px'}}>
                <div style={{ 'width': '600px', 'height': '250px', 'padding-top': '0px' }}>
                  <br></br>
                  <br></br>
                  {/*
                  <div class="buttons" style={{'padding-top':'18px', 'padding-left':'12px', 'padding-bottom':'22px'}}>
                      <Link to={`/vote/${this.state.key}`} ><button class="fill">Noticias</button></Link>
                      
                      <button class="fill">Contato</button>
                      <button class="fill">Registrar</button>
                      <button class="fill">Login</button>
                  </div>
                  */}


                  <div class="row">
                    <div class="example-2 card">
                      <div class="wrapper">
                        <div class="header">
                        </div>
                        <div class="data">
                          <div class="content">
                            <span class="author">Enquete</span>
                            <h1 class="title"><a href="/enquete/gwYLhurTb1KY7CFSRQK9">Quem você acha que merece ir para o quarto branco ? Vote!</a></h1>

                            <span class="text">Boninho confirma quarto branco essa semana!</span>
                            <center><Link to={`/enquete/gwYLhurTb1KY7CFSRQK9`} ><button class="fill">Participar</button></Link></center>
                            
                            
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


        <hr></hr>


        <div class="wrapper">
                    <div class="row" >
                    {this.state.enquetes.map(enquete =>
                    
                    <div class="column" style={{ 'border': '3px solid #e3e3e3', 'width': '320px', }}>
                    <img src={require(`./images/${enquete.capa}`)} style={{ 'border': '1px solid #e3e3e3', 'padding': '2px', 'top': '1px', 'display': 'block', 'margin': 'auto', 'height': '240px', ' max-height': '100%', 'width': 'auto', 'max-width': '100%' }} />

                    <div style={{ 'border': '0px solid  #ec6161', 'top': '1px', 'display': 'block', 'margin': 'auto', 'height': 'auto', ' max-height': '100%', 'width': 'auto', 'max-width': '100%' }}>
                      <b>{enquete.nome}</b><br></br><br></br>
                      {enquete.descricao}<br></br><br></br>
                      <center><a href={`/enquete/${enquete.id}`}><button class="fill">Participar</button></a></center>


                    </div>

                  </div>

                  )}
                    </div>
                </div>

                <div>
          <div>
            <ul class="social-networks square spin-icon" style={footerStyle}>
              <li><a href="https://www.facebook.com/" class="icon-facebook">Facebook</a></li>
              <li><a href="https://instagram.com" class="icon-instagram">Instagram</a></li>
              <li><a href="https://twitter.com/" class="icon-twitter">Twitter</a></li>
            </ul>
            <div style={{ 'text-align': 'center', }}>
              <p >© 2020 Copyright: enquetepop.com</p>
            </div>
            <br></br>

          </div>
        </div>




      </div>
      
      


    );
  }
}

export default Vote;
