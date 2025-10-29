import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Geladeira from './pages/Geladeira';
import GerarReceita from './pages/GerarReceita';
import Receitas from './pages/Receitas';
import SalvarReceita from './pages/SalvarReceita';
import AdminUsers from './pages/AdminUsers';
import './App.css';
import DetalheReceita from './pages/DetalheReceita';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/geladeira" element={<Geladeira />} />
        <Route path="/gerar-receita" element={<GerarReceita />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/salvar-receita" element={<SalvarReceita />} />
        <Route path="/salvar-receita/:id" element={<SalvarReceita />} />
        <Route path="/admin" element={<AdminUsers />} />
        <Route path="/receita/:id" element={<DetalheReceita />} />
      </Routes>
    </Router>
  );
}

export default App;
