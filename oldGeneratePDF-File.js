const moment = require('moment');
const PDFDocument = require('pdfkit');
const { off } = require('pdfkit');

const { max, min } = require('lodash');

const fontFamily = "ArialUnicode";
const boldFontFamily = "ArialUnicode-Bold";


const wordWrap = (str, maxWidth) => {
  let found = false;
  let res = [];
  while (str.length > maxWidth) {
    found = false;
    // Inserts new line at first whitespace of the line
    for (i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res.push(str.slice(0, i));
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res.push(str.slice(0, maxWidth));
      str = str.slice(maxWidth);
    }
  }

  res.push(str);

  return res;
};

const testWhite = (expression) => {
  const white = new RegExp(/^\s$/);
  return white.test(expression.charAt(0));
};

const withYValue = (generator, currYValue, doc) => {
  const threshold = 700;
  const nextYValue = generator(currYValue);
  if (nextYValue > threshold) {
    // doc.addPage()
    //   .fontSize(14)
    //   .text(
    //     "Additional info",
    //     50,
    //     50,
    //     { align: 'center', width: 500 }
    //   );
    // nextYValue = 160;
  }
  return nextYValue;
};

function generateHr({
  doc, y, color, lineWidth, length
}) {
  doc
    .strokeColor(color || '#aaaaaa')
    .lineWidth(lineWidth || 1)
    .moveTo(50, y)
    .lineTo(length || 550, y)
    .stroke();
}

function generateHeader({ doc, hotel }) {
  doc
    .fontSize(22)
    .font(boldFontFamily)
    .fillColor('#444444')
    .text(hotel, 50, 57)
    .fontSize(10)
    .text(moment(new Date()).format('MMM DD, YYYY'), 200, 62, { align: 'right' })
    .fontSize(15)
    .font(fontFamily)
    .text('Online check in confirmation', 50, 85)
    .moveDown();

  generateHr({
    doc,
    // color: '#2a8bf2',
    y: 110,
    lineWidth: 4
  });
}

const generateSignature = ({ doc, signature }) => (yValue) => {
  let y = yValue;
  doc.image(signature, 50, y, { height: 50, width: 100 });
  y += 40;
  generateHr({
    doc,
    y,
    lineWidth: 1,
    length: 170,
  });
  y += 5;

  doc
    .fontSize(10)
    .font(fontFamily)
    .text('Guest signature', 70, y);
  return y;
};

const generateGuestInfoRow = ({ doc, label, value, offset }) => (yValue) => {
  let y = yValue;
  const maxCharachters = 35;
  const boundedOffset = min([offset, maxCharachters * 7]);

  const wrappedLabels = wordWrap(label, maxCharachters);
  const wrappedValues = wordWrap(value, maxCharachters);

  const labelY = addTextToDoc(doc, wrappedLabels, boldFontFamily, y);
  const valueY = addTextToDoc(doc, wrappedValues, fontFamily, y, boundedOffset);

  y = max([labelY, valueY]);
  y += 15;
  return y;
};

const addTextToDoc = (doc, rows, font, y, offset = 0) => {
  let rowY = y;
  rows.forEach(rowText => {
    doc
      .fontSize(10)
      .font(font)
      .text(rowText, 50 + offset, rowY)
    rowY += 15;
  });

  return rowY;
}

const generateBookingInfo = ({ doc, checkedInAt, checkedOutAt }) => (yValue) => {
  let y = yValue;
  doc
    .fillColor('#444444')
    .fontSize(20)
    .font(boldFontFamily)
    .text('Booking information', 50, y);
  y += 30;

  generateHr({ doc, y });
  y += 15;

  doc
    .fontSize(10)
    .font(boldFontFamily)
    .text('Check in date', 50, y)
    .font(fontFamily)
    .text(moment(checkedInAt).format('MMM DD, YYYY'), 150, y);
  y += 15;

  doc
    .fontSize(10)
    .font(boldFontFamily)
    .text('Check out date', 50, y)
    .font(fontFamily)
    .text(moment(checkedOutAt).format('MMM DD, YYYY'), 150, y);

  y += 15;
  generateHr({ doc, y });
  y += 50;
  return y;
};


const generateGuestInfo = ({ doc, formData }) => (yValue) => {
  let y = yValue;
  const formatted_labels = {
    firstName: 'First name',
    lastName: 'Last name',
    documentType: 'Document type',
    documentValue: 'Document number',
  };

  doc
    .fillColor('#444444')
    .fontSize(20)
    .font(boldFontFamily)
    .text('Guest details', 50, y);
  y += 30;

  generateHr({ doc, y });
  y += 10;

  const offset = max(Object.keys(formData)
    .filter((key) => {
      const { type, value } = formData[key];
      return value && !['checkbox', 'signature', 'file'].includes(type);
    })
    .map((key) => {
      const { label } = formData[key];
      return formatted_labels[key] || label;
    })
    .map(_ => _.length)) * 7;

  for (const fieldKey of Object.keys(formData)) {
    const { type } = formData[fieldKey];
    let { label, value } = formData[fieldKey];
    if (
      value
      && !['checkbox', 'signature', 'file'].includes(type)
    ) {
      if (type === 'date') {
        y = withYValue(generateGuestInfoRow({ doc, label, value: moment(value).format('DD/MM/YYYY'), offset }), y, doc);
      } else {
        if (formatted_labels[fieldKey]) {
          label = formatted_labels[fieldKey];
        }
        if (typeof value === 'object') {
          value = value.name;
        }
        y = withYValue(generateGuestInfoRow({ doc, label, value, offset }), y, doc);
      }
    }
  }
  y += 5;
  generateHr({ doc, y });
  y += 25;
  return y;
};

function generateFooter({ doc }) {
  generateHr({
    doc,
    y: 740,
  });
  doc
    .fontSize(10)
    .text(
      'This check-in form was generated by EasyWay Technologies LTD',
      50,
      760,
      { align: 'center', width: 500 }
    )
    .text(
      'https://www.easyway.ai',
      50,
      775,
      { align: 'center', width: 500 }
    );
}

const generateCheckboxAnswer = ({ doc, checked, label }) => (yValue) => {
  let y = yValue;
  y += 30;
  doc
    .fontSize(10)
    .font(boldFontFamily)
    .text(`${label} : ${checked ? '✓' : '✗'}`,
      50,
      y,
      { align: 'left', width: 500 });
  return y;
};

function generateFilePages({ doc, files, label }) {
  const file_number = files.length;
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    let header = label;
    if (file_number > 1) {
      header = `${label} (${i + 1} of ${file_number})`;
    }
    doc.addPage()
      .fontSize(14)
      .text(
        header,
        50,
        50,
        { align: 'center', width: 500 }
      );
    doc.image(
      file,
      50,
      100,
      { fit: [500, 500], align: 'center', valign: 'center' }
    );
  }
}

const generatePDF = async function generatePDF({
  hotel,
  formData,
  checkedInAt,
  checkedOutAt,
}) {
  const pdfBuffer = await new Promise((resolve) => {
    let writing_y_value = 160;

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.registerFont('ArialUnicode', require('path').resolve(__dirname, './fonts/ArialUnicode.ttf'));
    doc.registerFont('ArialUnicode-Bold', require('path').resolve(__dirname, './fonts/ArialUnicode-Bold.ttf'));

    const { signature } = formData;

    generateHeader({ doc, hotel });
    writing_y_value = withYValue(generateBookingInfo({ doc, checkedInAt, checkedOutAt }), writing_y_value, doc);
    writing_y_value = withYValue(generateGuestInfo({ doc, formData }), writing_y_value, doc);
    if (signature) {
      if (!signature.value) {
        if (signature.required) throw "Signature is required";
      } else writing_y_value = withYValue(generateSignature({ doc, signature: signature.value }), writing_y_value, doc);
    }

    for (const field of Object.values(formData)) {
      const { id, type, text, value } = field;
      if (type === 'checkbox') {
        writing_y_value = withYValue(generateCheckboxAnswer({
          doc,
          checked: !!value,
          label: id === 'legal' ? 'Terms and conditions' : text,
        }), writing_y_value, doc);
      }
    }

    generateFooter({ doc });

    for (const field of Object.values(formData)) {
      const { type, label, value, required } = field;
      if (type === 'file') {
        if (!value && !required) continue;
        generateFilePages({ doc, files: value, label, });
      }
    }

    doc.end();

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });

  return Promise.resolve(pdfBuffer);
};

module.exports = generatePDF;
