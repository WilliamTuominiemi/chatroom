import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

import Chat from "./components/chat.component"

function App() {
  return (
    <Router>
      <Route path="/" exact component={Chat} />   
    </Router> 
  );
}

export default App;
