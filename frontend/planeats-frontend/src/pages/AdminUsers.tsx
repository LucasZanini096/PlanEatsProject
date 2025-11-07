import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userPhoto from '../assets/user.jpg';
import AppAdminHeader from '../components/AppAdminHeadser';
import UserCard from '../components/UserCard';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';

import type { Usuario } from '../interfaces/Usuario';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setError('');
      setLoading(true);
      const usuarios = await adminService.listarTodosUsuarios();
      setUsers(usuarios);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
      console.error('Erro ao carregar usuários:', err);
      
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        authService.clearToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await adminService.deletarUsuario(userId);
      alert('Usuário deletado com sucesso!');
      // Recarrega a lista após deletar
      await carregarUsuarios();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar usuário';
      alert(errorMessage);
      console.error('Erro ao deletar usuário:', err);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center">
        <p className="text-xl">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppAdminHeader />

      <main className="p-8 max-w-[1200px] mx-auto">
        <div className='w-full flex justify-between items-center'>
          <h2 className="text-[2.5rem] font-bold mt-4 mb-12">Lista de Usuários</h2>

          <button
            onClick={handleLogout}
            className="w-[20%] p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#FEA348] text-white hover:bg-[#de8125] transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <p className="text-center text-xl">Nenhum usuário encontrado.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.nome}
                role={user.role === 'ADMIN' ? 'Administrador' : 'Colaborador'}
                image={userPhoto}
                onDelete={() => handleDeleteUser(user.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}