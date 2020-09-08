import * as moment from 'moment';
import { max, min } from 'lodash';
import { DocumentFigure } from './document.figure';
import { Injectable } from '@nestjs/common';

interface DocumentGeneratorInterface {
  doc: any,
  label?: string,
  value?: string,
  images?: string,
  signatureImage?: string,
  offset?: number,
  writingYValue?: number
  formData?: any
  checked?: boolean,
  checkedInAt?: Date,
  checkedOutAt?: Date,
  hotel?: string
}

@Injectable()
export class DocumentGenerator extends DocumentFigure {
  private readonly boldFontFamily = 'ArialUnicode-Bold';
  private readonly fontFamily = 'ArialUnicode';
  private readonly formattedLabels: any = {
    firstName: 'First name',
    lastName: 'Last name',
    documentType: 'Document type',
    documentValue: 'Document number',
  };

  generateHeader({ doc, hotel }: DocumentGeneratorInterface): void {
    const textStyle = {
      fontSize: 20,
      fontHotel: this.boldFontFamily,
      fontDate: this.boldFontFamily,
      color: '#444444',
      textHotel: hotel,
      positionX: 50,
      positionY: 57,
      textDate: moment(new Date()).format('MMM DD, YYYY'),
      textConfirmation: 'Online check in confirmation',
      align: 'right',
      lineWidth: 4
    }
    doc
      .fontSize(textStyle.fontSize)
      .font(textStyle.fontHotel)
      .fillColor(textStyle.color)
      .text(textStyle.textHotel, textStyle.positionX, textStyle.positionY)

      .fontSize(textStyle.fontSize - 10)
      .text(textStyle.textDate, textStyle.positionX + 150, textStyle.positionY + 5, { align: textStyle.align })
      .fontSize(textStyle.fontSize - 5)
      .font(textStyle.fontDate)
      .text(textStyle.textConfirmation, textStyle.positionX, textStyle.positionY + 28)
      .moveDown();

    textStyle.color = '#2a8bf2';
    textStyle.positionY = 110;

    this.generateHr({ doc, color: textStyle.color, y: textStyle.positionY, lineWidth: textStyle.lineWidth });
  }

  generateBookingInfo ({ doc, checkedInAt, checkedOutAt, writingYValue }: DocumentGeneratorInterface): number {
    const textStyle = {
      positionY: writingYValue,
      positionX: 50,
      color: '#444444',
      fontSize: 20,
      font: this.boldFontFamily,
      text: 'Booking information',
      dateCheckedInAt: moment(checkedOutAt).format('MMM DD, YYYY'),
      dateCheckedOutAt: moment(checkedOutAt).format('MMM DD, YYYY'),
      textCheckIn: 'Check in date',
      textCheckOut: 'Check out date',
    }

    doc
      .fillColor(textStyle.color)
      .fontSize(textStyle.fontSize)
      .font(textStyle.font)
      .text(textStyle.text, textStyle.positionX, textStyle.positionY);
    textStyle.positionY += 30;

    this.generateHr({ doc, y: textStyle.positionY });
    textStyle.positionY += 15;

    doc
      .fontSize(textStyle.fontSize - 10)
      .font(textStyle.font)
      .text(textStyle.dateCheckedOutAt, textStyle.positionX, textStyle.positionY)
      .font(this.fontFamily)
      .text(textStyle.dateCheckedInAt, textStyle.positionX + 100, textStyle.positionY);
    textStyle.positionY += 15;

    doc
      .fontSize(textStyle.fontSize - 10)
      .font(textStyle.font)
      .text(textStyle.textCheckOut, textStyle.positionX, textStyle.positionY)
      .font(this.fontFamily)
      .text(textStyle.dateCheckedOutAt, textStyle.positionX + 100, textStyle.positionY);

    textStyle.positionY += 15;
    this.generateHr({ doc, y: textStyle.positionY });
    textStyle.positionY += 50;
    return textStyle.positionY;
  };

  generateGuestInfo ({ doc, formData, writingYValue }: DocumentGeneratorInterface): number {
    const textStyle ={
      text: 'Guest details',
      color: '#444444',
      font: this.boldFontFamily,
      fontSize: 20,
      positionX: 50,
      positionY: writingYValue
    }
    const guestDetails = formData.guestDetails;
    doc
      .fillColor(textStyle.color)
      .fontSize(textStyle.fontSize)
      .font(textStyle.font)
      .text(textStyle.text, textStyle.positionX, textStyle.positionY);
    textStyle.positionY += 30;

    this.generateHr({ doc, y: textStyle.positionY });
    textStyle.positionY += 10;
    const maxValueLength = guestDetails.reduce((a, b) => {
      return  a.value.length > b.value.length ? a : b
    });
    const offset = maxValueLength.value.length * 7;

    for (const index of guestDetails) {
      let { label, value } = index;

      if (this.formattedLabels[label]) {
        label = this.formattedLabels[label];
      }
      if (value instanceof Date) {
        value = moment(value).format('DD/MM/YYYY')
      }

      textStyle.positionY = this.generateGuestInfoRow({ doc, label, value, offset, writingYValue: textStyle.positionY });
    }
    textStyle.positionY += 5;
    this.generateHr({ doc, y: textStyle.positionY });

    return textStyle.positionY += 25;
  };

  generateSignature({ doc, signatureImage, writingYValue }: DocumentGeneratorInterface): number {
    const textStyle ={
      text: 'Guest details',
      font: this.fontFamily,
      fontSize: 10,
      positionX: 70,
      positionY: writingYValue,
      imageHeight: 50,
      imageWidth: 100,
      imagePositionX: 50,
      imagePositionY: writingYValue,
      lineWidth: 1,
      length: 170,
    }
    doc.image(signatureImage, textStyle.imagePositionX, textStyle.imagePositionY, { height: textStyle.imageHeight, width: textStyle.imageWidth });
    textStyle.positionY += 40;
    this.generateHr({
      doc,
      y: textStyle.positionY,
      lineWidth: textStyle.lineWidth,
      length: textStyle.length,
    });
    textStyle.positionY += 5;

    doc
      .fontSize(textStyle.fontSize)
      .font(textStyle.font)
      .text(textStyle.text, textStyle.positionX, textStyle.positionY);
    return textStyle.positionY;
  };

  generateCheckboxAnswer ({ doc, checked, label, writingYValue }: DocumentGeneratorInterface): number {
    const textStyle = {
      font: this.boldFontFamily,
      fontSize: 10,
      text: `${label} : ${checked ? '✓' : '✗'}`,
      positionX: 50,
      positionY: writingYValue,
      align: 'left',
      width: 500
    }

    textStyle.positionY += 30

    doc
      .fontSize(textStyle.fontSize)
      .font(textStyle.font)
      .text(textStyle.text,
        textStyle.positionX,
        textStyle.positionY,
        { align: textStyle.align, width: textStyle.width });
    return textStyle.positionY;
  };

  generateFilePages({ doc, images, label }: DocumentGeneratorInterface) : void {
    const textStyle = {
      fontSize: 14,
      positionX: 50,
      positionY: 50,
      align: 'center',
      width: 500,
      height: 400,
    }
    const fileNumber = images.length;
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      let header = label;
      if (fileNumber > 1) {
        header = `${label} (${i + 1} of ${fileNumber})`;
      }
      doc.addPage()
        .fontSize(textStyle.fontSize)
        .text(
          header,
          textStyle.positionX,
          textStyle.positionY,
          { align: textStyle.align, width: textStyle.width },
        );

      doc.image(image, textStyle.positionX, textStyle.positionY + 50, { height: textStyle.height, width: textStyle.width });
    }
  }

  generateFooter({ doc }: DocumentGeneratorInterface): void {
    const textStyle = {
      positionY: 740,
      footerText: 'This check-in form was generated by EasyWay Technologies LTD',
      footerLinkText: 'https://www.easyway.ai',
      fontSize: 10,
      positionX: 50,
      align: 'center',
      width: 500
    }

    this.generateHr({
      doc,
      y: textStyle.positionY,
    });
    textStyle.positionY += 20;
    doc
      .fontSize(textStyle.fontSize)
      .text(
        textStyle.footerText,
        textStyle.positionX,
        textStyle.positionY,
        { align: textStyle.align, width: textStyle.width },
      )
      .text(
        textStyle.footerLinkText,
        textStyle.positionX,
        textStyle.positionY + 15,
        { align: textStyle.align, width: textStyle.width },
      );
  }

  generateGuestInfoRow({ doc, label, value, offset, writingYValue }: DocumentGeneratorInterface): number {
    let positionY = writingYValue;

    const maxCharacters = 35;
    const boundedOffset = min([offset, maxCharacters * 7]);

    const wrappedLabels = this.wordWrap(label, maxCharacters);
    const wrappedValues = this.wordWrap(value, maxCharacters);

    const labelY = this.addTextToDoc(doc, wrappedLabels, this.boldFontFamily, positionY, 0);
    const valueY = this.addTextToDoc(doc, wrappedValues, this.fontFamily, positionY, boundedOffset);

    positionY = max([labelY, valueY]);
    positionY += 15;

    return positionY;
  };

  generateBodyText(doc: any, hotel: string, formData: any, checkedInAt: Date,checkedOutAt: Date): void {
    let writingYValue = 160;

    this.generateHeader({ doc, hotel });

    writingYValue = this.generateBookingInfo({ doc, checkedInAt, checkedOutAt, writingYValue });
    writingYValue = this.generateGuestInfo({ doc, formData, writingYValue });

    if (formData && formData.signature.value) {
      const {signature} = formData;
      if (!signature.value && formData.required) {
        throw 'Signature is required';
      } else {
        writingYValue = this.generateSignature({ doc, signatureImage: signature.value, writingYValue});
      }
    }

    if (formData && formData.checkbox.length) {
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

    if (formData && formData.files.images.length) {
      const { label, images, required } = formData.files;
      for (const field of images) {
        if (!images.length && !required) continue;
        this.generateFilePages({ doc, images, label });
      }
    }
  }
}
