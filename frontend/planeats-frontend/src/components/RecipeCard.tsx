import { useNavigate } from 'react-router-dom';
import hamburguerImg from '../assets/Hamburguer.png';

interface RecipeCardProps {
  id: number;
  name: string;
  image?: string | null;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export default function RecipeCard({ id, name, image, onDelete }: RecipeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/receita/${id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id, e);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 bg-white border-2 border-[#333] rounded-[15px] cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <img
          src={image || hamburguerImg}
          alt={name}
          className="w-20 h-20 object-cover rounded-[10px] border-2 border-[#333]"
          onError={(e) => {
            e.currentTarget.src = hamburguerImg;
          }}
        />
        <h3 className="text-xl font-semibold">{name}</h3>
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
        aria-label="Deletar receita"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}