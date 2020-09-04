import { Module } from '@nestjs/common';
import { GenerateFilesController } from './generateFiles.controller';
import { GenerateFilesService } from './generateFiles.service';

@Module({
  imports: [],
  controllers: [GenerateFilesController],
  providers: [GenerateFilesService],
})
export class GenerateFilesModule {}
