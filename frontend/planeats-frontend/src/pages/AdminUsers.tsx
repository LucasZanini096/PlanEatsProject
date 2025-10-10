import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userPhoto from '../assets/user.jpg'
import AppAdminHeader from '../components/AppAdminHeadser';
import UserCard from '../components/UserCard';

import type { UserCardInterface } from '../interfaces/UserCardInterface';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserCardInterface[]>([
    { id: 1, name: 'Usuário 01', role: 'Admnistrador', image: userPhoto },
    { id: 2, name: 'Usuário 02', role: 'Colaborador', image: userPhoto },
    { id: 3, name: 'Usuário 03', role: 'Colaborador', image: userPhoto },
  ]);

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppAdminHeader />

      <main className="p-8 max-w-[1200px] mx-auto">
        <div className='w-full flex justify-between items-center'>
             <h2 className="text-[2.5rem] font-bold mt-4 mb-12 ">Lista de Usuários</h2>

            <button
            onClick={() => navigate('/login')}
            className="w-[20%] p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#FEA348] text-white hover:bg-[#de8125] transition-colors duration-300"
          >
            Logout
          </button>
        </div>
       

        <div className="flex flex-col gap-6">
          {users.map((user) => (
            <UserCard id={user.id} name={user.name} role={user.role} image={user.image} />
          ))}
        </div>
      </main>
    </div>
  );
}