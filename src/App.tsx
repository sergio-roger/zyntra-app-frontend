import { useEffect } from 'react';
import { AppRouter } from '@routes/AppRouter';
import { useAuth } from '@features/auth/hooks/useAuth';

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
}

export default App;
