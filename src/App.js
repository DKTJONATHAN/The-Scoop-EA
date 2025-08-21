import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import the package
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Post from './pages/Post';

// YOUR UNIQUE VERIFICATION CODE (from the meta tag)
const gscVerificationCode = 'Qe5lWD9JQUizT6tfGM0Do_Xx3Hg1r18FbO_bB1nUW7Y';

function App() {
  return (
    <HelmetProvider> {/* Step 1: Wrap the app */}
      <Router>
        {/* Step 2: Place the Helmet component in the head */}
        <Helmet>
          <meta name="google-site-verification" content={gscVerificationCode} />
        </Helmet>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/post/:slug" element={<MainLayout><Post /></MainLayout>} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;