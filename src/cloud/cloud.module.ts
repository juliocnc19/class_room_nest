import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CloudService, PrismaService],
  exports: [CloudService],
  controllers: [CloudController],
})
export class CloudModule {}
