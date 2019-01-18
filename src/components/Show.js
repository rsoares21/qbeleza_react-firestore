import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('servicos');
    this.unsubscribe = null;
    this.state = {
      board: {},
      key: '',
      servicos: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const servicos = [];
    querySnapshot.forEach((doc) => {
      const { title, description, price } = doc.data();
      servicos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        price,
      });
    });
    this.setState({
      servicos
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    const ref = firebase.firestore().collection('servicos').doc(this.props.match.params.id);
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
  }

  delete(id){
    firebase.firestore().collection('servicos').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
      this.props.history.push("/")
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <br/>
            <h3 class="panel-title">
              {this.state.board.title}
            </h3>
          </div>
          <div class="panel-body">
            <br/>
            <dl>
              <dt>Descrição detalhada:</dt>
              <dd>{this.state.board.description}</dd>
              <dt>Preço:</dt>
              <dd>{this.state.board.price}</dd>
            </dl>
            <br/>
            <Link to="/" class="btn btn-info">Pronto</Link>&nbsp;
            <Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;
