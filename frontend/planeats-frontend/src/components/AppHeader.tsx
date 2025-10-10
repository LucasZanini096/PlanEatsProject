import { useNavigate, useLocation } from 'react-router-dom';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Adicione aqui a lógica de logout se necessário
    navigate('/login');
  };

  return (
    <header className="bg-[#FFB366] p-4 pb-6 border-2 border-t-0 border-[#333] rounded-b-[25px]">
      <nav className="flex justify-around items-center">
        <button
          onClick={() => navigate('/geladeira')}
          className={`flex flex-col items-center gap-2 text-[#333] font-semibold no-underline cursor-pointer hover:opacity-100 ${
            location.pathname === '/geladeira' ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <i className="fa-solid fa-stroopwafel text-[2.5rem]"></i>
          <span>Geladeira</span>
        </button>
        <button
          onClick={() => navigate('/gerar-receita')}
          className={`flex flex-col items-center gap-2 text-[#333] font-semibold no-underline cursor-pointer hover:opacity-100 ${
            location.pathname === '/gerar-receita' ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <i className="fa-solid fa-book text-[2.5rem]"></i>
          <span>Gerar Receita</span>
        </button>
        <button
          onClick={() => navigate('/receitas')}
          className={`flex flex-col items-center gap-2 text-[#333] font-semibold no-underline cursor-pointer hover:opacity-100 ${
            location.pathname === '/receitas' ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <i className="fa-solid fa-utensils text-[2.5rem]"></i>
          <span>Receitas</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-2 text-[#333] font-semibold no-underline opacity-70 cursor-pointer hover:opacity-100"
        >
          <i className="fa-solid fa-user text-[2.5rem]"></i>
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}
