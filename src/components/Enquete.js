import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

import './enq_mysass.scss';

import ReCAPTCHA from "react-google-recaptcha";

import $ from 'jquery'

class Enquete extends Component {

  constructor(props) {
    super(props);
    this.refParticipantes = firebase.firestore().collection('participantes').where(this.props.match.params.id, '==', true)
    this.CardsEnquetes = firebase.firestore().collection('enquetes').where('ativo', '==', true)
    this.state = {
      board: {},
      key: '',
      participantes: [],
      enquetes: [],
      totalVotos: 0,
      participantesPorOrdemVotos: []
    };

    this.votoValido = false;
    this.votoRealizado = false;
    this.captchaView = 'hidden';
    this.sucessoView = 'hidden';
    this.voteId = '';
    this.fotoVotado = 'blank.jpg';
    this.capa = 'blank.jpg';

  }

  componentDidMount() {

    const ref = firebase.firestore().collection('enquetes').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          board: doc.data(),
          key: doc.id,
          isLoading: false
        });
        this.capa = this.state.board.capa
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
    const participantesPorOrdemVotos = [];
    let totalVotos = 0

    //le o total de votos antes para saber calcular o percentual de cada um
    querySnapshot.forEach((doc) => {
      //alert(JSON.stringify(doc.data()))
      const { votos } = doc.data();
      totalVotos = totalVotos + votos
    });


    querySnapshot.forEach((doc) => {
      //alert(`update doc.data() : ${doc.id}`)
      const { nome, votos, fotoVotado } = doc.data();
      let percentual = (votos / totalVotos) * 100
      //this.participantesPorOrdemVotos = participantes.sort(this.compareVotos);
      participantes.push({
        nome: nome, votos: votos, fotoVotado: fotoVotado, id: doc.id, percentual: percentual
      });
      participantesPorOrdemVotos.push({
        nome: nome, votos: votos, fotoVotado: fotoVotado, id: doc.id, percentual: percentual
      });
      participantes.sort(this.compare);
      participantesPorOrdemVotos.sort(this.compareVotos);
      
      //totalVotos = totalVotos + votos

    });
    this.setState({
      participantes,
      totalVotos,
      participantesPorOrdemVotos
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
      const { nome, descricao, capa, ordem, texto1 } = doc.data();
      //let percentual = (votos / totalVotos) * 100
      if (doc.id != this.state.key) { // não mostra a própria enquete
        enquetes.push({
          nome: nome, descricao: descricao, capa: capa, ordem: ordem, texto1: texto1, id: doc.id
        });
      }
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

    if (this.votoValido == true) {
      const db = firebase.firestore();
      const increment = firebase.firestore.FieldValue.increment(1);

      // Document reference
      const participanteRef = db.collection('participantes').doc(id);

      // Update read count
      participanteRef.update({ votos: increment });
      this.votoRealizado = true;


    } else {
      //alert('Você deve ser um robô....')
    }

    this.votoValido = false;
    //alert('votou')

  }

  expiraVoto() {
    //alert('expirouuuu')
    this.votoValido = false
    //alert('habilitando voto')
    return
  }

  say(word) {
    alert(word)
  }

  habilitaVoto() {
    setTimeout(() => {
      //this.captchaView = 'visible';
      //alert(`id voto : ${this.voteId}`)
      if (this.votoValido == false) {
        document.getElementById('recaptcha').style.visibility = 'hidden'
        this.votoValido = true;
        this.votoRealizado = true;
        this.vote(this.voteId)
        document.getElementById('sucesso').style.visibility = 'visible'
      } else {
        this.votoValido = false
        this.votoRealizado = false;
      }

      //alert('habilita voto')
      return


    }, 350);
  }

  openReCaptcha(id, nome, fotoVotado) {
    
    window.scrollTo(0, 0)
    //this.captchaView = 'visible';
    document.getElementById('recaptcha').style.visibility = 'visible'
    this.voteId = id
    this.nomeVoto = nome;
    this.fotoVotado = fotoVotado;

  }

  closeSucesso() {
    //this.captchaView = 'visible';
    document.getElementById('sucesso').style.visibility = 'hidden'
    //window.grecaptcha.reset();

  }

  closeRecaptcha() {
    //this.captchaView = 'visible';
    document.getElementById('recaptcha').style.visibility = 'hidden'
    //window.grecaptcha.reset();

  }

  compare(a,b) {
    if (a.nome < b.nome)
       return -1;
    if (a.nome > b.nome)
      return 1;
    return 0;
  }

  compareVotos(a,b) {
    if (a.votos < b.votos)
       return 1;
    if (a.votos > b.votos)
      return -1;
    return 0;
  }




  render() {
    //const script = document.createElement("script");
    //script.src = "https://www.google.com/recaptcha/api.js";

    // Define a callback that is executed when the recaptcha has expired
    var onRecaptchaExpired = function () {

      alert("Your recatpcha has expired, please verify again ...");
      // You can reset it automatically if you want
      // grecaptcha.reset();
    };

    function onChange(value) {
      //this.recaptchaValidado = true
      this.habilitaVoto.bind(this)

      alert(`Voto validado: + ${this.votoValido}`);
    }

    const logoEnquetePop = {
      'position': 'relative',
      //'border-style': 'solid', //guia
      'border-color': 'orange',
      //'font-weight': 'bold',
      'text-align': 'center',
      'width': '1100px',
      'height': '100px',
      'margin-top': '30px'

    }

    const tituloPrincipal = {
      'position': 'relative',
      //'border-style': 'solid', //guia
      'border-color': 'green',
      'font-size': '50px',
      //'font-family': "monospace",
      //'font-family': "Georgia",
      'font-family': "Tahoma",
      //'font-family': "Lucida Console",
      //'font-weight': 'bold',
      //'color': '#6c3bd6',
      'color': '#4343d8',

      'text-align': 'center',
      'width': '1100px',
      'height': '160px',
      'padding-left': '20px',
      'padding-right': '20px',

    }

    const fotoPrincipal = {
      'position': 'relative',
      'border-style': 'solid',
      'border-color': 'magenta',
      'width': '70%',
      'height': '400px',
      'margin-left': '15px',
      'text-align': 'center'

    }

    const colunaBanners = {
      'position': 'relative',
      'border-style': 'solid',
      'border-color': 'brown',
      //'width': '100%',
      //'height': '100%',
      //'margin-left': '5px',
      'text-align': 'center',

    }
    const enqueteStyle = {
      //'border-style': 'solid', //guia
      'border-color': 'pink',
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



    function percentage(perc, votoRealizado) {
      if (votoRealizado == true) {
        return parseFloat(perc).toFixed(2) + '%'
      }


    }

    function closeRecaptcha() {

      //this.captchaView = 'hidden';
      this.votoValido = true;
      document.getElementById('recaptcha').style.visibility = 'hidden'

      //document.getElementById('recaptcha').style.visibility = 'hidden'
      //document.getElementById('recaptcha').style.visibility = 'hidden'

    }


    const recaptchaBoxStyle = {
      'position': 'absolute',
      'z-index': '1',
      'visibility': `${this.captchaView}`,
      //'top': '20%',
      //'left': '33%',
      'left': '370px',
      'width': '500px',
      'height': '500px',
      'background-color': '#4343d8',
      'border': '5px solid #ec6161',
      'border-radius': '50px 20px',
      'top': '180px',
      'opacity': '0.9',
      'padding-top': '25px'
    }

    const sucessoStyle = {
      'position': 'absolute',
      'z-index': '1',
      'visibility': `${this.sucessoView}`,
      'top': '180px',
      'left': '370px',
      'width': '500px',
      'height': '500px',
      'background-color': '#4343d8',
      'border': '5px solid #ec6161',
      'border-radius': '50px 20px',
      'opacity': '1',
      'color': 'white'

    }








    return (

      <div class='container' style={enqueteStyle}>

        <div id="recaptcha" class="recaptcha" style={recaptchaBoxStyle}>
          <center>
            {/*}
            <div id="g-recaptcha">
              <ReCAPTCHA
                sitekey="6LdbLN4UAAAAAFogRGK1Wc1dx3_0C4qODHUUZOSb"
                onChange={this.habilitaVoto.bind(this)}
                //onChange={closeRecaptcha}
                size="compact"
                type="image"
                theme="light"
              />
            </div>
            */}
            <button onClick={this.closeRecaptcha.bind(this)} class="btn btn-danger"><b> X </b></button><br></br><br></br>
            <img src={require(`./images/banner250x250.png`)} width="250" height="250" /><br></br><br></br>
            <button onClick={this.habilitaVoto.bind(this)} class="btn btn-warning"><b> CONFIRMAR VOTO </b></button>
            <div class="wrapper">

            </div>
          </center>
        </div>

        <div id="sucesso" style={sucessoStyle}>
          <center>
            <br></br>
            <table border="0">
              <tr>
                <td style={{ 'align': 'top' }}>
                  <img src={require(`./images/${this.fotoVotado}`)} width="180" height="200" style={{ 'border-radius': '5px 2px', 'border': '5px solid white', }} /><br></br><br></br>

                  <center><button onClick={this.closeSucesso.bind(this)} class="btn btn-warning"><b>FECHAR</b></button></center>
                </td>
                <td style={{ 'verticalAlign': 'top', 'paddingLeft': '20px' }}>
                  <br></br>
                  TEMPO REAL:<br></br><br></br>
                  {this.state.participantesPorOrdemVotos.map(participante =>
                    <tr>
                      <td>
                        <b>{participante.nome} {percentage(participante.percentual, this.votoRealizado)}</b>
                      </td>
                    </tr>
                  )}
                </td>
              </tr>

            </table>

          </center>
        </div>


        <div style={logoEnquetePop}>
          <Link to="/"><img src={require('./images/logo_enquetepop.png')} /></Link>

        </div>
        <div>
          <div style={tituloPrincipal}>
            {this.state.board.descricao}
          </div>
        </div>


        <div style={{ 'border-style': 'none', 'width': '1100px' }}>
          <table border="0" width="100%">
            <tr>
              <td style={{ 'verticalAlign': 'top' }}>
                <center>
                  <img src={require(`./images/${this.capa}`)} style={{ 'width': '750px', 'height': '400px', 'top': '1px' }} />
                  <center><br></br><b>{this.state.board.texto1}
</b></center>
                  <br></br>
                  {this.state.participantes.map(participante =>
                    <button onClick={this.openReCaptcha.bind(this, participante.id, participante.nome, participante.fotoVotado)} class="btn" style={{ 'background': '#4343d8', 'color': 'white', 'height': '60px', 'font-size': '25px' }}><b>&nbsp;&nbsp;{participante.nome} &nbsp;&nbsp;</b>
                    </button>
                    //<button onClick={this.habilitaVoto.bind(this, participante.id)} class="btn btn-warning"><b>{participante.nome} {percentage(participante.percentual, this.votoRealizado)}</b></button>
                  )}
                </center>
              </td>
              <td style={{ 'verticalAlign': 'top' }}>
                <img src={require('./images/banner_quadrado.gif')} /><br></br>
              </td>
            </tr>
          </table>
        </div>

        <div>
          <table border="0" width="100%">
            <tr>
              <td style={{ 'verticalAlign': 'top' }} width="750px">
                <div class="wrapper">
                  <div class="row" style={{ 'width': '750px', }} >
                    {this.state.enquetes.map(enquete =>

                      <div class="column" style={{ 'border': '0px solid #e3e3e3', 'width': '350px', 'border-radius': '10px 4px 0px', }}>
                        <img src={require(`./images/${enquete.capa}`)} style={{ 'padding': '2px', 'top': '1px', 'display': 'block', 'margin': 'auto', 'height': 'auto', ' max-height': '100%', 'width': 'auto', 'max-width': '100%' }} />
                        <div style={{ 'border': '1px solid  #6942d8', 'top': '1px', 'display': 'block', 'margin': 'auto', 'height': 'auto', ' max-height': '100%', 'width': 'auto', 'max-width': '100%' }}>
                          <b>{enquete.nome}</b><br></br><br></br>
                          {enquete.descricao}<br></br><br></br>

                          <center><a href={`/bounce/${enquete.id}`}><button class="fill">Participar</button></a></center>
                        </div>
                      </div>

                    )}
                  </div>
                </div>

              </td>
              <td width="340px" >
                <div style={{ 'paddingLeft': '8px' }}>
                  NOTICIAS - <br></br>
                  <a href="#"><b>Masterchef Profissionais</b></a> - Lorem Ipsum is simply dummy text unknown, but remaining essentially unchanged. It was popularised in the 1960s, Lorem Ipsum.<br></br>
                  <hr></hr>
                  <a href="#"><b>The Circle Brasil </b></a> - iquitous filler text. In seeing a sample of lorem ipsum, his interest was piqued by consectetur—a genuine, albeit rare, Latin<br></br><br></br>
                </div>

                <br></br>
                <img src={require('./images/banner_quadrado.gif')} />

              </td>
            </tr>

          </table>

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






        {/*<Link to="/"><button>Voltar</button></Link>*/}

      </div>




    );
  }
}

export default Enquete;
