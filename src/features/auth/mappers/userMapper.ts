import type { LoginUserDto } from "../types/auth.dto";
import type { User } from "../types/auth.schema";

export function toUser(dto: LoginUserDto): User{

    if (dto.role !== 'admin' && dto.role !== 'user') {
        throw new Error(`Rol de usuario no valido: ${dto.role}`);
    }
    
    return {
        id: dto.id,
        name: dto.name,
        email: dto.email,
        role: dto.role
    };
}