import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { HomePage } from '@pages/Home/Home';
import { LoginPage } from '@pages/Login/Login';
import { RegisterPage } from '@pages/Register/Register';
import { EventsPage } from '@pages/Events/Events';
import { NotFoundPage } from '@pages/NotFound/NotFound';
import './App.scss';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
