import { Injectable } from '@nestjs/common';
import { DocumentText } from './document.text';

interface LineInterface {
  doc: any,
  y: number,
  color?: string,
  lineWidth?: number,
  length?: number
}

@Injectable()
export class DocumentFigure extends DocumentText {
  private defaultStrokeColor = '#aaaaaa';
  private defaultLineSize = 550;

  generateHr({doc, y, color, lineWidth, length}: LineInterface): void {
    doc
      .strokeColor(color || this.defaultStrokeColor)
      .lineWidth(lineWidth || 1)
      .moveTo(50, y)
      .lineTo(length || this.defaultLineSize, y)
      .stroke();
  }
}
