import Home from './pages/Home.jsx'
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(){
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path='/' element={<Home/>} />
                </Routes>
            </Router>
        </ErrorBoundary>
    )
}

export default App;
