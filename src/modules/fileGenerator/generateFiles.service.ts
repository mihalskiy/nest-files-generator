import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import {defaultData} from './defaultData';
import { DocumentGenerator } from './document.generator';
import { ConfigService } from '../../config';
import * as path from 'path';

export interface DocumentInterface {
  hotel: string,
  formData: any,
  checkedInAt: Date,
  checkedOutAt: Date,
}


@Injectable()
export class GenerateFilesService extends DocumentGenerator {
  public readonly format = 'A4';
  public readonly margin = 50;
  public readonly ArialUnicodeFontURL: string;
  public readonly ArialUnicodeBoldFontURL: string;

  constructor(configService: ConfigService) {
    super();
    this.ArialUnicodeFontURL = configService.get('ArialUnicodeFontURL');
    this.ArialUnicodeBoldFontURL = configService.get('ArialUnicodeBoldFontURL');
  }

  async generateFile(documentType: string, InputData: any): Promise<Buffer> {
    if (!documentType) documentType = 'pdf';
    if(!InputData) InputData = defaultData
    return this[`${documentType}Generator`](InputData)
  }

  async pdfGenerator({hotel,formData,checkedInAt,checkedOutAt}: DocumentInterface): Promise<Buffer> {
    return await new Promise((resolve) => {
      const doc = new PDFDocument({ size: this.format, margin: this.margin });

      doc.registerFont('ArialUnicode', path.resolve(__dirname, '../../../', 'fonts/ArialUnicode.ttf'));
      doc.registerFont('ArialUnicode-Bold', path.resolve(__dirname, '../../../', 'fonts/ArialUnicode-Bold.ttf'));

      this.generateBodyText(doc, hotel,formData,checkedInAt,checkedOutAt)

      const buffers = [];

      doc.end();
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  };

  htmlGenerator (): Error {
    throw new HttpException('html generator not implement', HttpStatus.NOT_FOUND);
  }

  docGenerator (): Error {
    throw new HttpException('doc generator not implement', HttpStatus.NOT_FOUND);
  }
}
