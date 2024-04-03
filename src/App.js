import { Suspense } from 'react';
import RecruiterRoutes from './routes/RecruiterRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Suspense>
      <RecruiterRoutes />
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true} autoClose={1700} />
    </Suspense>
  );
}

export default App;
