import { useNavigate } from 'react-router-dom';
import comidaImg from '../assets/comida.png';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full">
      {/* Painel da Imagem */}
      <div className="w-1/2 h-full">
        <img
          src={comidaImg}
          alt="Ingredientes frescos como salmão, tomate, alho e limão"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Painel do Formulário */}
      <div className="w-1/2 flex justify-center items-center p-8 bg-[#F0EAD6]">
        <div className="bg-[#FFB366] p-12 rounded-[25px] border-2 border-[#333] w-full max-w-[450px] text-center">
          {/* Logo */}
          <h1 className="text-[4rem] font-bold m-0 leading-none">
            <span className="text-[#007BFF]">Plan</span>
            <span className="text-[#28a745]">Eats</span>
          </h1>
          
          {/* Slogan */}
          <p className="text-lg font-['Courier_New',Courier,monospace] text-[#543D2B] mt-2 mb-8 border-b-2 border-[#543D2B] inline-block">
            Menos desperdício, mais sabor
          </p>

          {/* Formulário para realizar login */}
          <LoginForm />

          {/* Link para Cadastro */}
          <p className="font-semibold text-[#333] mb-2 mt-0">
            Ainda não tem uma conta?
          </p>
          <button
            onClick={() => navigate('/cadastro')}
            className="w-full p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#007BFF] text-white hover:bg-[#0056b3] transition-colors duration-300"
          >
            CADASTRE-SE
          </button>
        </div>
      </div>
    </div>
  );
}
