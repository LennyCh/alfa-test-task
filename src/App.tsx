import React from 'react';
import './App.css';
import MainPage from "./components/MainPage/MainPage";
import {UsersStore} from "./store/UsersStore";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  return (
    <div className="App">
      <MainPage usersStore={new UsersStore()} />
    </div>
  );
}

export default App;
