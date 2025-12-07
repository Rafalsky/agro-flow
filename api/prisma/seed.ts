import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Zootechnician
    // Clean up if exists (to ensure id/tokens are consistent)
    // Actually upsert is better but matching by what? DisplayName? 
    // Since we don't have unique email, we rely on finding by ID or just creating new if not found?
    // Let's use specific IDs for Dev environment to be deterministic.

    const zooId = '11111111-1111-1111-1111-111111111111';
    const zoo = await prisma.user.upsert({
        where: { id: zooId },
        update: {},
        create: {
            id: zooId,
            role: 'ZOOTECHNICIAN',
            displayName: 'Zootechnician',
            isActive: true,
            magicLinks: {
                create: {
                    id: 'dev-zootech',
                    role: 'ZOOTECHNICIAN'
                }
            }
        },
    });

    // Ensure magic link exists if user already existed (upsert update didn't touch it)
    // We can try to create magic link separately ignoring duplicates
    try {
        await prisma.magicLink.create({
            data: {
                id: 'dev-zootech',
                role: 'ZOOTECHNICIAN',
                userId: zoo.id
            }
        });
    } catch (e) { } // Ignore if exists

    console.log(`User created: ${zoo.displayName}`);

    // 2. Worker
    const workerId = '22222222-2222-2222-2222-222222222222';
    const worker = await prisma.user.upsert({
        where: { id: workerId },
        update: {},
        create: {
            id: workerId,
            role: 'WORKER',
            displayName: 'Jan Kowalski',
            isActive: true,
            magicLinks: {
                create: {
                    id: 'dev-worker',
                    role: 'WORKER'
                }
            }
        },
    });

    try {
        await prisma.magicLink.create({
            data: {
                id: 'dev-worker',
                role: 'WORKER',
                userId: worker.id
            }
        });
    } catch (e) { } // Ignore if exists

    console.log(`User created: ${worker.displayName}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
