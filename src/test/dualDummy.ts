
import { IEventParagraph } from "storeV2";

const koSingleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }]
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [
      {
        words: [{
          text: '플리피'
        }, {
          text: '춤추고'
        }]
      }
    ]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM'
        }]
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3'
        }, {
          text: 'Z'
        }]
      }
    ]
  }
];

const koLineStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [
      {
        words: [{
          text: '플리피'
        }, {
          text: '춤추고'
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM'
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3'
        }, {
          text: 'Z'
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }
];

const koWordStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [
      {
        words: [{
          text: '플리피',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }, {
          text: '춤추고',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }]
      }
    ]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }]
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }, {
          text: 'Z',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }]
      }
    ]
  }
];

const koLineWordStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [
      {
        words: [{
          text: '플리피',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }, {
          text: '춤추고',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }, {
          text: 'Z',
          style: {
            background: { r: 165, g: 174, b: 246, a: 0.5 },
            bold: true,
            italic: false,
            underline: false,
            color: { r: 191, g: 222, b: 255, a: 1 },
            outlineColor: { r: 0, g: 0, b: 0, a: 1 },
            outline: 3,
            fontSize: 100,
            font: 4
          }
        }],
        style: {
          background: { r: 255, g: 255, b: 255, a: 0 },
          bold: true,
          italic: true,
          underline: true,
          color: { r: 169, g: 175, b: 2, a: 1 },
          outlineColor: { r: 16, g: 78, b: 4, a: 1 },
          outline: 1,
          fontSize: 200,
          font: 3
        }
      }
    ]
  }
];

const enSingleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul'
      }, {
        text: 'National'
      }, {
        text: 'University'
      }, {
        text: 'Peace'
      }, {
        text: 'System'
      }]
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }]
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM'
        }]
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3'
        }, {
          text: 'Z'
        }]
      }
    ]
  }
];

const enLineStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul'
      }, {
        text: 'National'
      }, {
        text: 'University'
      }, {
        text: 'Peace'
      }, {
        text: 'System'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM'
        }],
        style: {
          background: { r: 150, g: 150, b: 150, a: 150 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 150, g: 150, b: 150, a: 150 },
          outlineColor: { r: 150, g: 150, b: 150, a: 150 },
          outline: 1,
          fontSize: 150,
          font: 5
        }
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3'
        }, {
          text: 'Z'
        }],
        style: {
          background: { r: 150, g: 150, b: 150, a: 150 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 150, g: 150, b: 150, a: 150 },
          outlineColor: { r: 150, g: 150, b: 150, a: 150 },
          outline: 1,
          fontSize: 150,
          font: 5
        }
      }
    ]
  }
];

const enWordStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'National',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'University',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Peace',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'System',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }]
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'Z',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }]
      }
    ]
  }
];

const enLineWordStyleDummy: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'National',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'University',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Peace',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'System',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [
      {
        words: [{
          text: 'SM',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }],
        style: {
          background: { r: 150, g: 150, b: 150, a: 150 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 150, g: 150, b: 150, a: 150 },
          outlineColor: { r: 150, g: 150, b: 150, a: 150 },
          outline: 1,
          fontSize: 150,
          font: 5
        }
      }
    ]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [
      {
        words: [{
          text: '3',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'Z',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }],
        style: {
          background: { r: 150, g: 150, b: 150, a: 150 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 150, g: 150, b: 150, a: 150 },
          outlineColor: { r: 150, g: 150, b: 150, a: 150 },
          outline: 1,
          fontSize: 150,
          font: 5
        }
      }
    ]
  }
];



const resultDummy11: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }]
    }, {
      words: [
        {
          text: 'Seoul'
        }, {
          text: 'National'
        }, {
          text: 'University'
        }, {
          text: 'Peace'
        }, {
          text: 'System'
        }]
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피'
      }, {
        text: '춤추고'
      }],
    }, {
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }]
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM'
      }]
    }, {
      words: [{
        text: 'SM'
      }]
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3'
      },
      {
        text: 'Z'
      }]
    }, {
      words: [{
        text: '3'
      },
      {
        text: 'Z'
      }]
    }]
  }
];

const resultDummy21: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [
        {
          text: 'Seoul'
        }, {
          text: 'National'
        }, {
          text: 'University'
        }, {
          text: 'Peace'
        }, {
          text: 'System'
        }]
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피'
      }, {
        text: '춤추고'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }]
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'SM'
      }]
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }]
    }]
  }
];

const resultDummy12: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }]
    }, {
      words: [
        {
          text: 'Seoul'
        }, {
          text: 'National'
        }, {
          text: 'University'
        }, {
          text: 'Peace'
        }, {
          text: 'System'
        }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }

    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피'
      }, {
        text: '춤추고'
      }],
    }, {
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM'
      }]
    }, {
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }]
    }, {
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }
];

const resultDummy22: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [
        {
          text: 'Seoul'
        }, {
          text: 'National'
        }, {
          text: 'University'
        }, {
          text: 'Peace'
        }, {
          text: 'System'
        }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피'
      }, {
        text: '춤추고'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }
];

const resultDummyReberse22: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [
        {
          text: 'Seoul'
        }, {
          text: 'National'
        }, {
          text: 'University'
        }, {
          text: 'Peace'
        }, {
          text: 'System'
        }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '서울대'
      }, {
        text: '평화체제'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy'
      }, {
        text: 'is'
      }, {
        text: 'dancing'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '플리피'
      }, {
        text: '춤추고'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: 'SM'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '3'
      }, {
        text: 'Z'
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  }
];

const resultDummy33: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }, {
      words: [
        {
          text: 'Seoul',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'National',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'University',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'Peace',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }, {
          text: 'System',
          style: {
            background: { r: 100, g: 100, b: 100, a: 1000 },
            bold: false,
            italic: false,
            underline: false,
            color: { r: 100, g: 100, b: 100, a: 100 },
            outlineColor: { r: 100, g: 100, b: 100, a: 100 },
            outline: 1,
            fontSize: 100,
            font: 5
          }
        }]
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '춤추고',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
    }, {
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }, {
      words: [{
        text: 'SM',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }, {
      words: [{
        text: '3',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }]
  }
];

const resultDummyReberse33: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'National',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'University',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Peace',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'System',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }, {
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }, {
      words: [{
        text: '플리피',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '춤추고',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    }, {
      words: [{
        text: 'SM',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }]
    },
    {
      words: [{
        text: '3',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }]
    }]
  }
];

const resultDummy44: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'Seoul',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'National',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'University',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Peace',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'System',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: '플리피',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '춤추고',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: 'SM',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }, {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }, {
      words: [{
        text: '3',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }]
  }
];

const resultDummyReberse44: IEventParagraph[] = [
  {
    start: 29.79,
    end: 31.77,
    lines: [{
      words: [{
        text: 'Seoul',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'National',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'University',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Peace',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'System',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '서울대',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '평화체제',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 33.12,
    end: 35.79,
    lines: [{
      words: [{
        text: 'Flippy',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'is',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'dancing',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '플리피',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: '춤추고',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 38.311,
    end: 38.88,
    lines: [{
      words: [{
        text: 'SM',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: 'SM',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  },
  {
    start: 40.38,
    end: 41.13,
    lines: [{
      words: [{
        text: '3',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 100, g: 100, b: 100, a: 1000 },
          bold: false,
          italic: false,
          underline: false,
          color: { r: 100, g: 100, b: 100, a: 100 },
          outlineColor: { r: 100, g: 100, b: 100, a: 100 },
          outline: 1,
          fontSize: 100,
          font: 5
        }
      }],
      style: {
        background: { r: 150, g: 150, b: 150, a: 150 },
        bold: false,
        italic: false,
        underline: false,
        color: { r: 150, g: 150, b: 150, a: 150 },
        outlineColor: { r: 150, g: 150, b: 150, a: 150 },
        outline: 1,
        fontSize: 150,
        font: 5
      }
    }, {
      words: [{
        text: '3',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }, {
        text: 'Z',
        style: {
          background: { r: 165, g: 174, b: 246, a: 0.5 },
          bold: true,
          italic: false,
          underline: false,
          color: { r: 191, g: 222, b: 255, a: 1 },
          outlineColor: { r: 0, g: 0, b: 0, a: 1 },
          outline: 3,
          fontSize: 100,
          font: 4
        }
      }],
      style: {
        background: { r: 255, g: 255, b: 255, a: 0 },
        bold: true,
        italic: true,
        underline: true,
        color: { r: 169, g: 175, b: 2, a: 1 },
        outlineColor: { r: 16, g: 78, b: 4, a: 1 },
        outline: 1,
        fontSize: 200,
        font: 3
      }
    }]
  }
];

const realDual: IEventParagraph[] = [{
  start: 0.36,
  end: 1.36,
  lines: [{
    words: [{
      text: 'It'
    }, {
      text: 'was'
    }, {
      text: 'considered'
    }, {
      text: 'an'
    }, {
      text: 'essential'
    }, {
      text: 'skill'
    }, {
      text: 'for',
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
    }, {
      text: 'gameplay'
    }]
  }],
}, {
  start: 1.36,
  end: 2.854,
  lines: [{
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
    },
    words: [{
      text: '이는'
    }, {
      text: '게임플레이에',
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
    }, {
      text: '필수적인'
    }, {
      text: '기술로'
    }, {
      text: '여겨졌습니다'
    },]
  }, {
    words: [{
      text: 'It'
    }, {
      text: 'was'
    },{
      text: 'considered'
    }, {
      text: 'an'
    }, {
      text: 'essential'
    }, {
      text: 'skill'
    }, {
      text: 'for',
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
    }, {
      text: 'gameplay'
    }]
  }],
}, {
  start: 3.84,
  end: 5.84,
  lines: [{
    words: [{
      text: 'But'
    }, {
      text: 'Lee'
    }, {
      text: 'Hyuk-jae'
    }, {
      text: 'was'
    }, {
      text: 'an'
    }, {
      text: 'unintentional'
    }, {
      text: 'play,'
    }, {
      text: 'so'
    }, {
      text: 'I'
    }, {
      text: 'learned'
    }]
  }],
}, {
  start: 5.84,
  end: 6.05,
  lines: [{
    words: [{
      text: '하지만'
    }, {
      text: '이혁재'
    }, {
      text: '의도되지',
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
    }, {
      text: '않았던'
    }, {
      text: '플레이였기에'
    }, {
      text: '시간이'
    }]
  }, {
    words: [{
      text: 'But'
    }, {
      text: 'Lee'
    }, {
      text: 'Hyuk-jae'
    }, {
      text: 'was'
    }, {
      text: 'an'
    }, {
      text: 'unintentional'
    }, {
      text: 'play,'
    }, {
      text: 'so'
    }, {
      text: 'I'
    }, {
      text: 'learned'
    }]
  }]
}, {
  start: 6.05,
  end: 6.969,
  lines: [{
    words: [{
      text: '지나'
    }, {
      text: '패치로이나',
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
    }, {
      text: '사라지게',
    }, {
      text: '배웠는데요'
    }],
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
  }, {
    words: [{
      text: 'But'
    }, {
      text: 'Lee'
    }, {
      text: 'Hyuk-jae'
    }, {
      text: 'was'
    }, {
      text: 'an'
    }, {
      text: 'unintentional'
    }, {
      text: 'play,'
    }, {
      text: 'so'
    }, {
      text: 'I'
    }, {
      text: 'learned'
    }]
  }]
}, {
  start: 6.969,
  end: 9,
  lines: [{
    words: [{
      text: '지나'
    }, {
      text: '패치로이나',
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
    }, {
      text: '사라지게',
    }, {
      text: '배웠는데요'
    }],
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
  }, {
    words: [{
      text: 'to'
    }, {
      text: 'disappear'
    }, {
      text: 'with'
    }, {
      text: 'a'
    }, {
      text: 'patch'
    }, {
      text: 'over'
    }, {
      text: 'time.'
    }]
  }]
}]


const dualDummy = {
  "KoSingle": koSingleDummy,
  "EnSingle": enSingleDummy,
  "KoLineStyle": koLineStyleDummy,
  "EnLineStyle": enLineStyleDummy,
  "KoWordStyle": koWordStyleDummy,
  "EnWordStyle": enWordStyleDummy,
  "KoLineWordStyle": koLineWordStyleDummy,
  "EnLineWordStyle": enLineWordStyleDummy,
  "KoSingle-EnSingle": resultDummy11,
  "KoLineStyle-EnSingle": resultDummy21,
  "KoSingle-EnLineStyle": resultDummy12,
  "KoLineStyle-EnLineStyle": resultDummy22,
  "EnLineStyle-KoLineStyle": resultDummyReberse22,
  "KoWordStyle-EnWordStyle": resultDummy33,
  "EnWordStyle-KoWordStyle": resultDummyReberse33,
  "KoLineWordStyle-EnLineWordStyle": resultDummy44,
  "EnLineWordStyle-KoLineWordStyle": resultDummyReberse44,
  "Real": realDual
};

export default Object.freeze(dualDummy);