import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css"

import Chat from "./components/chat.component"
import Main from "./components/main.component"

function App() {
  return (
    <Router>
      <Route path="/" exact component={Main} />   
      <Route path="/:id" exact component={Chat} />   
    </Router> 
  );
}

export default App;
