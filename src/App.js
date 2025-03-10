import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

// Import pages & components

import Home from "./pages/home/Home";
import Analytics from "./pages/home/Analytics";
import Avatar from "./pages/avatar/setavatar";
import TableData from "./pages/home/TableData";
import Header from "./components/Header"



const App = () => {
  return (

    <div className="App" style={{ backgroundColor: "black" }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/tabledata" element={<TableData />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;