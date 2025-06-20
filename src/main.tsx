// src/main.tsx - Updated to handle disguised routes
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Route handler component for disguised URLs
const RouteHandler: React.FC = () => {
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main app route */}
        <Route path="/" element={<App />} />
        
        {/* Disguised routes - these will all render the same App component */}
        <Route path="/fashion/:product" element={<RouteHandler />} />
        <Route path="/style/:product" element={<RouteHandler />} />
        <Route path="/outfit/:product" element={<RouteHandler />} />
        <Route path="/clothes/:product" element={<RouteHandler />} />
        <Route path="/trends/:product" element={<RouteHandler />} />
        <Route path="/beauty/:product" element={<RouteHandler />} />
        <Route path="/makeup/:product" element={<RouteHandler />} />
        <Route path="/food/:product" element={<RouteHandler />} />
        <Route path="/recipe/:product" element={<RouteHandler />} />
        <Route path="/restaurant/:product" element={<RouteHandler />} />
        <Route path="/cafe/:product" element={<RouteHandler />} />
        <Route path="/menu/:product" element={<RouteHandler />} />
        <Route path="/cooking/:product" element={<RouteHandler />} />
        <Route path="/music/:product" element={<RouteHandler />} />
        <Route path="/playlist/:product" element={<RouteHandler />} />
        <Route path="/concert/:product" element={<RouteHandler />} />
        <Route path="/artist/:product" element={<RouteHandler />} />
        <Route path="/album/:product" element={<RouteHandler />} />
        <Route path="/song/:product" element={<RouteHandler />} />
        <Route path="/movie/:product" element={<RouteHandler />} />
        <Route path="/film/:product" element={<RouteHandler />} />
        <Route path="/series/:product" element={<RouteHandler />} />
        <Route path="/show/:product" element={<RouteHandler />} />
        <Route path="/entertainment/:product" element={<RouteHandler />} />
        <Route path="/review/:product" element={<RouteHandler />} />
        <Route path="/travel/:product" element={<RouteHandler />} />
        <Route path="/destination/:product" element={<RouteHandler />} />
        <Route path="/hotel/:product" element={<RouteHandler />} />
        <Route path="/vacation/:product" element={<RouteHandler />} />
        <Route path="/trip/:product" element={<RouteHandler />} />
        <Route path="/guide/:product" element={<RouteHandler />} />
        <Route path="/fitness/:product" element={<RouteHandler />} />
        <Route path="/workout/:product" element={<RouteHandler />} />
        <Route path="/health/:product" element={<RouteHandler />} />
        <Route path="/diet/:product" element={<RouteHandler />} />
        <Route path="/yoga/:product" element={<RouteHandler />} />
        <Route path="/exercise/:product" element={<RouteHandler />} />
        <Route path="/tech/:product" element={<RouteHandler />} />
        <Route path="/gadget/:product" element={<RouteHandler />} />
        <Route path="/phone/:product" element={<RouteHandler />} />
        <Route path="/laptop/:product" element={<RouteHandler />} />
        <Route path="/specs/:product" element={<RouteHandler />} />
        <Route path="/game/:product" element={<RouteHandler />} />
        <Route path="/gaming/:product" element={<RouteHandler />} />
        <Route path="/mobile/:product" element={<RouteHandler />} />
        <Route path="/app/:product" element={<RouteHandler />} />
        <Route path="/download/:product" element={<RouteHandler />} />
        <Route path="/play/:product" element={<RouteHandler />} />
        <Route path="/news/:product" element={<RouteHandler />} />
        <Route path="/article/:product" element={<RouteHandler />} />
        <Route path="/blog/:product" element={<RouteHandler />} />
        <Route path="/story/:product" element={<RouteHandler />} />
        <Route path="/update/:product" element={<RouteHandler />} />
        <Route path="/info/:product" element={<RouteHandler />} />
        <Route path="/event/:product" element={<RouteHandler />} />
        <Route path="/party/:product" element={<RouteHandler />} />
        <Route path="/celebration/:product" element={<RouteHandler />} />
        <Route path="/invitation/:product" element={<RouteHandler />} />
        <Route path="/join/:product" element={<RouteHandler />} />
        
        {/* Catch all route */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)