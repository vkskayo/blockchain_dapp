import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: "80vh", padding: "2rem" }}>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}

export default App;
