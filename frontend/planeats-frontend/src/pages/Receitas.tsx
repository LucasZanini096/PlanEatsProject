import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import hamburguerImg from '../assets/Hamburguer.png';
import RecipeCard from '../components/RecipeCard';
import type { RecipeCardInterface } from '../interfaces/RecipeCardInterface';


export default function Receitas() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeCardInterface[]>([
    { id: 1, name: 'Hamburguer fitness', image: hamburguerImg },
    { id: 2, name: 'Hamburguer fitness', image: hamburguerImg },
    { id: 3, name: 'Hamburguer fitness', image: hamburguerImg },
  ]);

  const handleDeleteRecipe = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleRecipeClick = (id: number) => {
    navigate(`/salvar-receita/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[800px] mx-auto text-center">
        <h2 className="text-[2.5rem] font-bold mt-4 mb-12">Minhas receitas</h2>

        <div className="flex flex-col gap-6">
          {recipes.map((recipe) => (
            <RecipeCard id={recipe.id} name={recipe.name} image={recipe.image} />
          ))}
        </div>
      </main>
    </div>
  );
}
