import type { UserCardInterface } from '../interfaces/UserCardInterface';

interface UserCardProps extends UserCardInterface {
  onDelete?: () => void;
}

export default function UserCard({ name, role, image, onDelete }: UserCardProps) {
  return (
    <div className="bg-[#FFB366] p-6 rounded-[25px] border-2 border-[#333] flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full border-2 border-[#333] object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-[#333]">{name}</h3>
          <p className="text-[#543D2B]">{role}</p>
        </div>
      </div>
      
      {onDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-[15px] border-2 border-[#333] transition-colors cursor-pointer"
        >
          Deletar
        </button>
      )}
    </div>
  );
}