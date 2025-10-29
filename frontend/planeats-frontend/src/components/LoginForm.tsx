import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    admin: false,
    adminCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Dados de login:", formData);
    setLoading(true);
    setError(null);
    try {
      await authService.signin(formData);
      navigate("/geladeira");
    } catch (err: unknown) {
      let message = "Erro ao fazer login";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string") {
          message = maybeMessage;
        }
      }
      setError(message);
      setLoading(false);
      return;
    
  };
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="text-left">
        <label htmlFor="email" className="block mb-2 font-semibold text-[#333]">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-2 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />

        <label htmlFor="senha" className="block mb-2 font-semibold text-[#333]">
          Senha
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          className="w-full p-3 mb-2 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="admin"
            name="admin"
            checked={formData.admin}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="admin" className="mb-0 font-semibold text-[#333]">
            Administrador?
          </label>
        </div>

        {/* Renderiza o campo apenas quando admin for true */}
        {formData.admin && (
          <div className="mb-6">
            <label
              htmlFor="adminCode"
              className="block mb-2 font-semibold text-[#333]"
            >
              Código do Administrador
            </label>
            <input
              type="text"
              id="adminCode"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              required={formData.admin} // required só quando admin === true
              className="w-full p-3 mb-6 border-2 border-[#333] rounded-[15px] bg-[#E0E0E0] text-base box-border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-[20px] border-2 border-[#333] text-lg font-bold cursor-pointer bg-[#90EE90] text-[#333] hover:bg-[#7CFC00] transition-colors duration-300 mb-6 disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'LOGIN'}
        </button>
      </form>
    </>
  );
}
