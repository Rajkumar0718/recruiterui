import { Router, Routes, Route } from 'react-router-dom';
import RecruiterLogin from './components/Recruiter/RecruiterLogin';
function App() {
  return (
    <div>
        <Router>
        <Routes>
        <Route path='/' exact component={RecruiterLogin} />
        </Routes>
        </Router>


    </div>
  );
}

export default App;
