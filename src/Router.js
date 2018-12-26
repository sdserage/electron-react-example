import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Image from './Image';
import  Settings from './Settings';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/image" component={Image} />
      <Route path="/settings" component={Settings} />
    </Switch>
  </BrowserRouter>
)