import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        // Default to WORKER if not specified, though usually we strictly control creation
        return this.prisma.user.create({
            data: {
                ...data,
                role: data.role || UserRole.WORKER,
                // Since we use magic links/auth tokens, no password hashing needed here for now
            },
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            orderBy: { displayName: 'asc' },
        });
    }

    async findOne(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        // Prevent changing own role or critical stuff? For now simple CRUD.
        try {
            return await this.prisma.user.update({
                where: { id },
                data,
            });
        } catch (error) {
            // Handle record not found
            throw new NotFoundException('User not found');
        }
    }

    async remove(id: string): Promise<User> {
        // Soft delete usually better, but requirements say "Deactivate" 
        // Schema has `isActive` Boolean @default(true)
        // So "remove" might actually be "deactivate"
        // Let's implement DELETE as actual delete for now, or update setIsActive?
        // Project plan said "Deactivate worker". 
        // Let's do Soft Delete via update.

        return this.prisma.user.update({
            where: { id },
            data: { isActive: false }
        });
    }
}
