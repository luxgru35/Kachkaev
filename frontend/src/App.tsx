import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { HomePage } from '@pages/Home/Home';
import { LoginPage } from '@pages/Login/Login';
import { RegisterPage } from '@pages/Register/Register';
import { EventsPage } from '@pages/Events/Events';
import { ProfilePage } from '@pages/Profile/Profile';
import { NotFoundPage } from '@pages/NotFound/NotFound';
import { EventFormModal } from '@components/EventFormModal/EventFormModal';
import './App.scss';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <EventFormModal />
      </Layout>
    </Router>
  );
}

export default App;
