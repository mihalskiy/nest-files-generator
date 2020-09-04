import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentInsertText {
  addTextToDoc (doc: any, rows: Array<[string]>, font: string, y: number, offset: number): number {
    let rowY = y;
    rows.forEach(rowText => {
      doc
        .fontSize(10)
        .font(font)
        .text(rowText, 50 + offset, rowY);
      rowY += 15;
    });

    return rowY;
  }

  wordWrap (str: string, maxWidth: number): Array<[string]> {
    let found = false;
    const res = [];
    while (str.length > maxWidth) {
      found = false;
      for (let i = maxWidth - 1; i >= 0; i--) {
        if (this.testWhite(str.charAt(i))) {
          res.push(str.slice(0, i));
          str = str.slice(i + 1);
          found = true;
          break;
        }
      }
      if (!found) {
        res.push(str.slice(0, maxWidth));
        str = str.slice(maxWidth);
      }
    }
    res.push(str);

    return res;
  };

  testWhite (expression: string): boolean {
    const white = new RegExp(/^\s$/);
    return white.test(expression.charAt(0));
  };
}
