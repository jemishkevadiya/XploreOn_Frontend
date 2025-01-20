import React from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

class App extends React.Component {
  render() {
    return (
      <div>
        <Home />
        <Navbar />
      </div>
    );
  }
}

export default App;
