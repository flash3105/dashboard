import React from 'react';
import './App.css';
import Home from './pages/Home';
import Overview from './pages/Overview';
import Insights from './pages/Insights';
import History from './pages/History';
import AN from './pages/AN';
import Settings from './pages/Settings';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Geospatial from './pages/Geospatial';


function App() {
    return (
        <Router>
           
           
                <Sidebar />
          

            <div className="content">
                    <Routes>
                        <Route path='/' element={<Home />} /> {/* Default route */}
                        <Route path='/Home' element={<Home />} />
                        <Route path='/Overview' element={<Overview />} />
                        <Route path='/Insights' element={<Insights />} />
                        <Route path='/Geospatial' element={<Geospatial />} />
                        <Route path='/History' element={<History />} />
                        <Route path='/AN' element={<AN />} />
                        <Route path='/Settings' element={<Settings />} />
                    </Routes>
                    
                    </div>
                
        </Router>
    );
}

export default App;
