import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Create extends Component {

  constructor() {
    super();
    this.ref = firebase.firestore().collection('servicos');
    this.state = {
      title: '',
      description: '',
      price: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { title, description, price } = this.state;

    this.ref.add({
      title,
      description,
      price
    }).then((docRef) => {
      this.setState({
        title: '',
        description: '',
        price: ''
      });
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  render() {
    const { title, description, price } = this.state;
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br/>
            <h3 class="panel-title">
              Novo serviço de Beleza
            </h3>
          </div>
          <div class="panel-body">
            <h4><Link to="/" class="btn btn-info">Voltar</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Nome do serviço:</label>
                <input type="text" class="form-control" name="title" value={title} onChange={this.onChange} placeholder="Nome" />
              </div>
              <div class="form-group">
                <label for="description">Descrição :</label>
                <textArea class="form-control" name="description" onChange={this.onChange} placeholder="Descrição detalhada" cols="80" rows="3">{description}</textArea>
              </div>
              <div class="form-group">
                <label for="price">Preço:</label>
                <input type="text" class="form-control" name="price" value={price} onChange={this.onChange} placeholder="Preço" />
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
