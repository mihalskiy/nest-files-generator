import { Injectable } from '@nestjs/common';
import { DocumentInsertText } from './document-insert.text';

interface LineInterface {
  doc: any,
  y: number,
  color?: string,
  lineWidth?: number,
  length?: number
}

@Injectable()
export class DocumentFigure extends DocumentInsertText {
  private readonly defaultStrokeColor = '#aaaaaa';
  private readonly defaultLineSize = 550;

  generateHr({doc, y, color, lineWidth, length}: LineInterface): void {
    const textStyle = {
      color: color || this.defaultStrokeColor,
      lineWidth: lineWidth || 1,
      positionX: 50,
      positionY: y,
      lineTo: length || this.defaultLineSize
    }

    doc
      .strokeColor(textStyle.color)
      .lineWidth(textStyle.lineWidth)
      .moveTo(textStyle.positionX, textStyle.positionY)
      .lineTo(textStyle.lineTo, textStyle.positionY)
      .stroke();
  }
}
