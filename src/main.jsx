import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import PDFUpload from './PDFUpload';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/pdf" element={<PDFUpload />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

