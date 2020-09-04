import { Controller, Get, Query, Res } from '@nestjs/common';
import { GenerateFilesService } from './generateFiles.service';

export interface InputGenerateFile {
  documentType: string,
  InputData: {
    hotel: string,
    formData: any,
    checkedInAt: Date,
    checkedOutAt: Date,
  }
}

@Controller()
export class GenerateFilesController {
  constructor(private readonly filesService: GenerateFilesService) {}

  @Get()
  async getProfile(@Query() query: InputGenerateFile, @Res() response): Promise<File>  {
    try {
      const {documentType, InputData} = query;
      return response.send(await this.filesService.generateFile(documentType, InputData));
    } catch (error) {
      response.send(error)
    }
  }
}
