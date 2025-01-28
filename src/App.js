import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

class App extends React.Component {
  render() {
    const domain = "dev-kev7s4z6gs7nu4wv.us.auth0.com"; // Replace with your Auth0 domain
    const clientId = "dXPbXYTpwPTp44DcKZaxSuMvhLDITwSp";         // Replace with your Auth0 client ID
    const audience = "https://my-api/";      // Replace with your Auth0 API identifier

    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin, // URL to redirect after login/logout
          audience: audience,                  // Specify the audience for access tokens
          scope: "openid profile email",       // Define requested scopes
        }}
      >
        <Router>
          {/* Navbar remains visible on all pages */}
          <Navbar />
          {/* Define routes for different pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </Auth0Provider> 
    );
  }
}

export default App;
