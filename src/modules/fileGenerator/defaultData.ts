export const defaultData = {
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
