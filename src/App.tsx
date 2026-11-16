import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import Categories from './pages/Categories';
import CategoryPage from './pages/CategoryPage';
import PlatformPage from './pages/PlatformPage';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import { PrivacyPage, TermsPage, ContactPage, AboutPage } from './pages/StaticPages';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApps from './pages/admin/AdminApps';
import AdminAppEdit from './pages/admin/AdminAppEdit';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="app/:slug" element={<AppDetail />} />
                <Route path="categories" element={<Categories />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="platform/:platform" element={<PlatformPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="about" element={<AboutPage />} />
              </Route>
              {/* Admin */}
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="apps" element={<AdminApps />} />
                <Route path="apps/new" element={<AdminAppEdit />} />
                <Route path="apps/:id" element={<AdminAppEdit />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
