import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { Detail } from './pages/Detail';
import { Search } from './pages/Search';
import { Publish } from './pages/Publish';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <UserProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="map" element={<Map />} />
              <Route path="search" element={<Search />} />
              <Route path="publish" element={<Publish />} />
              <Route path="profile" element={<Profile />} />
              <Route path="login" element={<Login />} />
              <Route path="restaurant/:id" element={<Detail />} />
            </Route>
          </Routes>
        </HashRouter>
      </UserProvider>
    </HelmetProvider>
  </StrictMode>
);