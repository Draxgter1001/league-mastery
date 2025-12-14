import Home from './pages/Home.jsx'
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function App(){
    return (
        <ErrorBoundary>
            <Home/>
        </ErrorBoundary>
    )
}

export default App;
