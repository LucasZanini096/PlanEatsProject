import { useState } from 'react';
import type { FormEvent } from 'react';
import AppHeader from '../components/AppHeader';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

export default function Geladeira() {
  const [ingredientName, setIngredientName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Maçã', quantity: 3 },
    { id: 2, name: 'Banana', quantity: 2 },
    { id: 3, name: 'Frango', quantity: 1 },
    { id: 4, name: 'Arroz', quantity: 5 },
    { id: 5, name: 'Feijão', quantity: 2 },
    { id: 6, name: 'Tomate', quantity: 4 },
  ]);

  const handleAddIngredient = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ingredientName.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now(),
        name: ingredientName,
        quantity: quantity,
      };
      setIngredients([...ingredients, newIngredient]);
      setIngredientName('');
      setQuantity(1);
    }
  };

  const updateIngredientQuantity = (id: number, delta: number) => {
    setIngredients(
      ingredients
        .map((ing) =>
          ing.id === id
            ? { ...ing, quantity: Math.max(0, ing.quantity + delta) }
            : ing
        )
        .filter((ing) => ing.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-[#F0EAD6]">
      <AppHeader />

      <main className="p-8 max-w-[900px] mx-auto text-center">
        {/* Seção Adicionar Ingrediente */}
        <section>
          <h2 className="text-[2rem] font-bold mt-4 mb-8">
            Adicionar ingrediente
          </h2>
          <form
            onSubmit={handleAddIngredient}
            className="flex justify-center items-center flex-wrap gap-6 mb-12"
          >
            <div className="text-left">
              <label
                htmlFor="ingrediente"
                className="block mb-2 font-semibold"
              >
                Ingrediente
              </label>
              <input
                type="text"
                id="ingrediente"
                name="ingrediente"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
                className="p-3 border-2 border-[#333] rounded-[15px] bg-white text-base w-[250px]"
              />
            </div>
            <div className="text-left">
              <label htmlFor="quantidade" className="block mb-2 font-semibold">
                Quantidade
              </label>
              <div className="flex items-center border-2 border-[#333] rounded-[15px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-3 px-4 cursor-pointer"
                >
                  -
                </button>
                <span className="py-3 px-5 bg-white text-base font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-3 px-4 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#90EE90] text-[#333] py-3 px-8 rounded-[20px] border-2 border-[#333] text-base font-bold cursor-pointer self-end hover:bg-[#7CFC00] transition-colors"
            >
              Adicionar
            </button>
          </form>
        </section>

        {/* Seção Meus Ingredientes */}
        <section>
          <h2 className="text-[2rem] font-bold mt-4 mb-8">Meus ingredientes</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between bg-white p-2 px-4 border-2 border-[#333] rounded-[20px]"
              >
                <div className="flex items-center gap-4 font-semibold">
                  <div className="w-[30px] h-[30px] bg-[#E0E0E0] rounded-full flex justify-center items-center">
                    <div className="w-[15px] h-[15px] bg-red-500 rounded-full"></div>
                  </div>
                  <span>
                    {ingredient.quantity} {ingredient.name}
                  </span>
                </div>
                <div className="flex items-center border-2 border-[#333] rounded-[15px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateIngredientQuantity(ingredient.id, -1)}
                    className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-2 px-3 cursor-pointer"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => updateIngredientQuantity(ingredient.id, 1)}
                    className="bg-[#FFB366] border-none text-[#333] text-xl font-bold py-2 px-3 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
