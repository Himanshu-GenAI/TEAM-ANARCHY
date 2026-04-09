import { BackgroundPaths } from '../components/ui/background-paths';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { isAuthenticated, user } = useApp();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  return <BackgroundPaths title="UniSync AI" />;
}
