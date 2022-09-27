import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React, {useState} from 'react';

import {BrowserRouter, Route, Switch} from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import MainContainer from "./components/MainContainer";
import CartManager from "./util/CartManager";


function App() {
    return (
        <BrowserRouter basename="/">
            {/*<BrowserRouter>*/}
            <MainContainer/>

        </BrowserRouter>
    );
}

export default App;
