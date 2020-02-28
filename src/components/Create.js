import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('surveys');
    this.state = {
      nome: '',
      descricao: '',
      ordem: '',
      participantes: [{ nome: 'Bianca', votos: 1 },{ nome: 'Felipe', votos: 2 }, { nome: 'Flyslane', votos: 1 }]
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { nome, descricao, ordem, participantes } = this.state;

    this.ref.add({
      nome,
      descricao,
      ordem,
      participantes
    }).then((docRef) => {
      this.setState({
        nome: '',
        descricao: '',
        ordem: '',
        participantes:[]
      });
      this.props.history.push("/")
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    const { nome, descricao, ordem } = this.state;
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br />
            <h3 class="panel-title">
              Novo serviço de Beleza (RF)
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/" class="btn btn-info">Voltar</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="nome">Nome do serviço:</label>
                <input type="text" class="form-control" name="nome" value={nome} onChange={this.onChange} placeholder="Nome" />
              </div>
              <div class="form-group">
                <label for="descricao">Descrição :</label>
                <textArea class="form-control" name="descricao" onChange={this.onChange} placeholder="Descrição detalhada" cols="80" rows="3">{descricao}</textArea>
              </div>
              <div class="form-group">
                <label for="ordem">Preço:</label>
                <input type="text" class="form-control" name="ordem" value={ordem} onChange={this.onChange} placeholder="Preço" />
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create
