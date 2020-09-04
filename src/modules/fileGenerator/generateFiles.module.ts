import { Module } from '@nestjs/common';
import { GenerateFilesController } from './generateFiles.controller';
import { GenerateFilesService } from './generateFiles.service';
import { ConfigModule } from '../../config';

@Module({
  imports: [ConfigModule.register({ folder: './config' })],
  controllers: [GenerateFilesController],
  providers: [GenerateFilesService],
})
export class GenerateFilesModule {}
