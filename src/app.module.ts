import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { GenerateFilesModule } from './modules/fileGenerator/generateFiles.module';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    GenerateFilesModule
  ],
})
export class AppModule {}
