import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TransactionDashboard from './components/TransactionDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TransactionDashboard />
    </QueryClientProvider>
  );
}

export default App;