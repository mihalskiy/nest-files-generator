import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';
import { DocumentGenerator } from './document.generator';

const testDefaultData = {
  hotel: 'wefr',
  formData: {
      type: 'file',
      required: 'true',
      id: 1,
      files: [
        {
          label: 'photo',
          images: ['./image.jpg'],
          required: true
        }
      ],
      text: 'weefeww',
      guestDetails: [
        { label: 'firstName', value: 'First name' },
        { label: 'Last name', value: 'Last name' },
        { label: 'Document type', value: 'Document type' },
        { label: 'Document ', value: 'Document ' },
        { label: 'Happy birthday-test', value: new Date() },
      ],
      checkbox: [
        {
          id: 'legal',
          text: 'He protec, he attac, but most importantly he hac',
          value: false
        },
        {
          id: 2,
          text: 'He protec, he attac, but most importantly he hac',
          value: true
        }
      ],
      signature: {
        value: './image.jpg',
        label: 'wdew',
      },
    },
  checkedInAt: new Date(),
  checkedOutAt: new Date(),
}

interface DocumentInterface {
  hotel: string,
  formData: any,
  checkedInAt: Date,
  checkedOutAt: Date
}


@Injectable()
export class GenerateFilesService extends DocumentGenerator {
  public format = 'A4';
  public margin = 50

  async generateFile(type: string, InputData: any) {
    if (!type) type = 'pdf';
    if(!InputData) InputData = testDefaultData
    return this[`${type}Generator`](InputData)
  }

  async pdfGenerator({hotel,formData,checkedInAt,checkedOutAt}: DocumentInterface): Promise<Buffer> {

    return await new Promise((resolve) => {
      let writingYValue = 160;
      const doc = new PDFDocument({ size: this.format, margin: this.margin });

      doc.registerFont('ArialUnicode', path.resolve(__dirname, '../../../', 'fonts/ArialUnicode.ttf'));
      doc.registerFont('ArialUnicode-Bold', path.resolve(__dirname, '../../../', 'fonts/ArialUnicode-Bold.ttf'));

      this.generateHeader({ doc, hotel });

      writingYValue = this.generateBookingInfo({ doc, checkedInAt, checkedOutAt, writingYValue });
      writingYValue = this.generateGuestInfo({ doc, formData, writingYValue });

      if (formData && formData.signature) {
        const {signature} = formData;
        if (!signature.value && formData.required) {
          throw 'Signature is required';
        } else {
          writingYValue = this.generateSignature({ doc, signatureImage: signature.value, writingYValue});
        }
      }

      if (formData && formData.checkbox) {
        for (const field of formData.checkbox) {
          const { id, text, value } = field;
          writingYValue = this.generateCheckboxAnswer({
            doc,
            checked: !!value,
            label: id === 'legal' ? 'Terms and conditions' : text,
            writingYValue
          });
        }
      }

      this.generateFooter({ doc });

      if (formData && formData.files) {
        for (const field of formData.files) {
          const { label, images, required } = field;
          if (!images.length && !required) continue;
          this.generateFilePages({ doc, images, label });
        }
      }

      const buffers = [];

      doc.end();
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
    });
  };

  htmlGenerator () {
    throw 'html generator not implement'
  }

  docGenerator () {
    throw 'doc generator not implement'
  }

}
