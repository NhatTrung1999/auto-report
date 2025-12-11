import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import AppRoutes from './routes';

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
