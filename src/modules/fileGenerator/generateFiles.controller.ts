import { Body, Controller, Post, Res } from '@nestjs/common'
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

  @Post('generate-document')
  async getProfile(@Body() body: InputGenerateFile,  @Res() response): Promise<File>  {
    try {
      return response.send(await this.filesService.generateFile(body));
    } catch (error) {
      response.send(error)
    }
  }
}
