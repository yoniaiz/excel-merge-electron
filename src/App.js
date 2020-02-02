import React, { useState, Fragment } from "react";


import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainPage from "./components/MainPage";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Preview = () => {
  return (
    <div id="container" />
  )
}
const App = () => {
  

  const showImage = () => {
    ipcRenderer.send("toggle-settings");
  };
  return (
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route  exect path="/" component={MainPage}/>
          <Route  exect path="/preview" component={Preview}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
