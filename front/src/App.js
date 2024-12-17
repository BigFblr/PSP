import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import AuthForm from './components/AuthForm';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/attendance" element={
                        <PrivateRoute>
                            <AttendanceForm />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;