import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Zootechnician
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

    try {
        await prisma.magicLink.create({
            data: {
                id: 'dev-zootech',
                role: 'ZOOTECHNICIAN',
                userId: zoo.id
            }
        });
    } catch (e) { }

    console.log(`User created: ${zoo.displayName}`);

    // 2. Workers
    const workers = [
        { id: '22222222-2222-2222-2222-222222222222', name: 'Jan Kowalski', linkId: 'dev-worker-1' },
        { id: '22222222-2222-2222-2222-222222222223', name: 'Anna Nowak', linkId: 'dev-worker-2' },
        { id: '22222222-2222-2222-2222-222222222224', name: 'Piotr Wiśniewski', linkId: 'dev-worker-3' },
        { id: '22222222-2222-2222-2222-222222222225', name: 'Maria Dąbrowska', linkId: 'dev-worker-4' }
    ];

    for (const workerData of workers) {
        const worker = await prisma.user.upsert({
            where: { id: workerData.id },
            update: {},
            create: {
                id: workerData.id,
                role: 'WORKER',
                displayName: workerData.name,
                isActive: true,
                magicLinks: {
                    create: {
                        id: workerData.linkId,
                        role: 'WORKER'
                    }
                }
            },
        });

        try {
            await prisma.magicLink.create({
                data: {
                    id: workerData.linkId,
                    role: 'WORKER',
                    userId: worker.id
                }
            });
        } catch (e) { }

        console.log(`User created: ${worker.displayName}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
