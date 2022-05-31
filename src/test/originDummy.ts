import { ICaptionsParagraph } from "storeV2";
const dummy1 = [
  {
    lines: [
      {
        words: [
          {
            confidence: 0.114,
            text: '서울대',
            start: 29.79,
            end: 30.957,
            id: 1343
          },
          {
            confidence: 0.184,
            text: '평화체제',
            start: 30.96,
            end: 31.77,
            id: 1344
          }
        ],
        id: 183
      }
    ],
    id: 1345
  },
  {
    lines: [
      {
        words: [
          {
            confidence: 0.889,
            text: '플리피',
            start: 33.12,
            end: 34.41,
            id: 1346
          },
          {
            confidence: 0.995,
            text: '춤추고',
            start: 34.44,
            end: 35.79,
            id: 1347
          }
        ],
        id: 184
      }
    ],
    id: 1348
  },
  {
    lines: [
      {
        words: [
          {
            confidence: 0.866,
            text: 'SM',
            start: 38.311,
            end: 38.88,
            id: 1349
          }
        ],
        id: 185
      }
    ],
    id: 1350
  },
  {
    lines: [
      {
        words: [
          {
            confidence: 0.992,
            text: '3',
            start: 40.38,
            end: 40.796,
            id: 1351
          },
          {
            confidence: 0.859,
            text: 'Z',
            start: 40.8,
            end: 41.13,
            id: 1352
          }
        ],
        id: 186
      }
    ],
    id: 1353
  }
]

const realOrigin = [
  {
    lines: [
      {
        words: [
          {
            confidence: 0.773,
            text: '이는',
            start: 1.36,
            end: 1.54,
            id: 0
          },
          {
            confidence: 0.816,
            text: '게임플레이에',
            start: 1.54,
            end: 1.953,
            id: 1,
            style: {
              color: {
                r: 245,
                g: 223,
                b: 77,
                a: 1
              },
              outline: 3,
              outlineColor: {
                r: 0,
                g: 0,
                b: 0,
                a: 1
              },
              bold: true,
              underline: false,
              italic: false
            }
          },
          {
            confidence: 1,
            text: '필수적인',
            start: 1.953,
            end: 2.259,
            id: 2
          },
          {
            confidence: 0.686,
            text: '기술로',
            start: 2.259,
            end: 2.456,
            id: 3
          },
          {
            confidence: 0.979,
            text: '여겨졌습니다',
            start: 2.458,
            end: 2.854,
            id: 4
          }
        ],
        id: 0,
        style: {
          background: {
            r: 255,
            g: 255,
            b: 255,
            a: 0
          },
          color: {
            r: 206,
            g: 56,
            b: 38,
            a: 1
          },
          outline: 3,
          outlineColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
          },
          bold: true,
          underline: false,
          italic: false,
          font: 4,
          fontSize: 100
        }
      }
    ],
    id: 5
  },
  {
    lines: [
      {
        words: [
          {
            confidence: 0.941,
            text: '하지만',
            start: 5.84,
            end: 5.871,
            id: 6
          },
          {
            confidence: 0.242,
            text: '이혁재',
            start: 5.871,
            end: 5.895,
            id: 7
          },
          {
            confidence: 0.987,
            text: '의도되지',
            start: 5.895,
            end: 5.926,
            id: 8,
            style: {
              color: {
                r: 255,
                g: 255,
                b: 255,
                a: 1
              },
              outline: 3,
              outlineColor: {
                r: 0,
                g: 0,
                b: 0,
                a: 1
              },
              bold: true,
              underline: false,
              italic: false
            }
          },
          {
            confidence: 0.997,
            text: '않았던',
            start: 5.926,
            end: 5.95,
            id: 9
          },
          {
            confidence: 0.788,
            text: '플레이였기에',
            start: 5.95,
            end: 5.995,
            id: 10
          },
          {
            confidence: 1,
            text: '시간이',
            start: 6.023,
            end: 6.05,
            id: 11
          }
        ],
        id: 1
      }
    ],
    id: 12
  },
  {
    lines: [
      {
        words: [
          {
            confidence: 0.972,
            text: '지나',
            start: 6.05,
            end: 6.504,
            id: 13
          },
          {
            confidence: 0.794,
            text: '패치로이나',
            start: 6.504,
            end: 7.412,
            id: 14,
            style: {
              color: {
                r: 255,
                g: 254,
                b: 0,
                a: 1
              },
              outline: 1,
              outlineColor: {
                r: 155,
                g: 84,
                b: 25,
                a: 1
              },
              italic: true
            }
          },
          {
            confidence: 0.915,
            text: '사라지게',
            start: 7.412,
            end: 8.047,
            id: 15
          },
          {
            confidence: 0.938,
            text: '배웠는데요',
            start: 8.05,
            end: 9,
            id: 16
          }
        ],
        id: 2,
        style: {
          background: {
            r: 255,
            g: 255,
            b: 255,
            a: 0
          },
          color: {
            r: 255,
            g: 223,
            b: 255,
            a: 1
          },
          outline: 3,
          outlineColor: {
            r: 88,
            g: 21,
            b: 192,
            a: 1
          },
          bold: true,
          underline: false,
          italic: false,
          font: 4,
          fontSize: 100
        }
      }
    ],
    id: 17
  }
];

const originDummy: ICaptionsParagraph[][] = [dummy1, realOrigin];
export default Object.freeze(originDummy);