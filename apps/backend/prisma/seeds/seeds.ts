      import { PrismaClient } from '@prisma/client';
import { BcryptService } from 'src/infra/services/bcrypt/bcrypt.service';

      const prisma = new PrismaClient();
      const bcrypt = new BcryptService();
      async function seed() {
        await prisma.user.create({
          data: {
            email: 'admin@email.com',
            password: await bcrypt.hash('123456'),
            firstName: 'admin',
            lastName: 'admin',
          },
        });
      }
      seed()
        .catch((error) => {
          console.error(error);
          process.exit(1);
        })
        .finally(async () => {
          await prisma.$disconnect();
        });