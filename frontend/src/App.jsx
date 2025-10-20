import './index.css'; {/* This single CSS file is used for the entire website. Styles are also provided inline in some cases */}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Homepage from './pages/Homepage';
import CustomerLanding from './pages/CustomerLanding';
import AdminLanding from './pages/AdminLanding';
import Add from './pages/Add';
import Update from './pages/Update';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Displays <Homepage /> if '/' is the path - it is the main starting project for this website for a user */}
        <Route path="/" element={<Homepage />} />
        {/* Allows login as customer and admin and allows admin to add and update menu_items table via two separate routes '/add' and '/update/:id' */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRole="Customer">
            <CustomerLanding />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="Admin">
            <AdminLanding />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute allowedRole="Admin">
            <Add />
          </ProtectedRoute>
        } />
        <Route path="/update/:id" element={
          <ProtectedRoute allowedRole="Admin">
            <Update />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;