import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      nome: '',
      descricao: '',
      origemiid: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('surveys').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const board = doc.data();
        this.setState({
          key: doc.id,
          nome: board.title,
          descricao: board.description,
          origemiid: board.price
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({board:state});
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { nome, descricao, origemid } = this.state;

    const updateRef = firebase.firestore().collection('surveys').doc(this.state.key);
    updateRef.set({
      nome,
      descricao,
      origemid
    }).then((docRef) => {
      this.setState({
        key: '',
        nome: '',
        descricao: '',
        origemid: ''
      });
      //this.props.history.push("/show/"+this.props.match.params.id)
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br/>
            <h3 class="panel-title">
              Votar (RF)
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to={`/show/${this.state.key}`} class="btn btn-info">Voltar</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" name="title" value={this.state.nome} onChange={this.onChange} placeholder="Nome" />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" class="form-control" name="description" value={this.state.descricao} onChange={this.onChange} placeholder="Descrição detalhada" />
              </div>
              <div class="form-group">
                <label for="price">Preço:</label>
                <input type="text" class="form-control" name="price" value={this.state.origemid} onChange={this.onChange} placeholder="Preço" />
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;
