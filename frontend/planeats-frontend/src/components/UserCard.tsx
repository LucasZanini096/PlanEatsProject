import type { UserCardInterface } from '../interfaces/UserCardInterface'

export default function UserCard(user: UserCardInterface) {

  return (
    <>
       <div
          key={user.id}
          className="flex items-center bg-white border-2 border-[#333] rounded-[15px] overflow-hidden text-left cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <img
            src={user.image}
            alt={`Foto de ${user.name}`}
            className="w-[100px] h-[80px] object-cover"
          />
          <div className='w-full flex justify-between'>
              <p className="px-6 font-semibold text-lg m-0">
                {user.name}
              </p>

               <p className="px-6 font-semibold text-lg m-0">
                {user.role}
              </p>
          </div>


          <button
            className="bg-[#FFB366] border-none px-8 self-stretch cursor-pointer transition-colors hover:bg-[#ff9f43] relative z-[2]"
          >
            <i className="fa-solid fa-trash text-2xl text-white"></i>
          </button>
        </div>
    
    </>
  )
  
}