import { Suspense } from 'react';
import RecruiterRoutes from './routes/RecruiterRoutes';
function App() {
  return (
    <Suspense>
      <RecruiterRoutes />
    </Suspense>
  );
}

export default App;
