import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { Detail } from './pages/Detail';
import { Search } from './pages/Search';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<Map />} />
          <Route path="search" element={<Search />} />
          <Route path="restaurant/:id" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);