import { useNavigate } from 'react-router-dom';
import type { RecipeCardInterface } from '../interfaces/RecipeCardInterface';

export default function RecipeCard(recipe: RecipeCardInterface) {
  const navigate = useNavigate();

  return(
    <div
      key={recipe.id}
      //onClick={() => handleRecipeClick(recipe.id)}
      onClick={() => navigate(`/salvar-receita`)}
      className="flex items-center bg-white border-2 border-[#333] rounded-[15px] overflow-hidden text-left cursor-pointer transition-transform hover:scale-[1.02]"
    >
      <img
        src={recipe.image}
        alt={`Foto de ${recipe.name}`}
        className="w-[100px] h-[80px] object-cover"
      />
      <p className="flex-grow px-6 font-semibold text-lg m-0">
        {recipe.name}
      </p>
      <button
        //onClick={(e) => handleDeleteRecipe(recipe.id, e)}
        className="bg-[#FFB366] border-none px-8 self-stretch cursor-pointer transition-colors hover:bg-[#ff9f43] relative z-[2]"
      >
        <i className="fa-solid fa-trash text-2xl text-white"></i>
      </button>
    </div>
  )
  
}