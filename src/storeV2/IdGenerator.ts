
export interface IdFieldDictionary {
  'origin': {
    caption: number;
    paragraph: number;
    line: number;
    word: number;
  }
  'multiline': {
    caption: number;
    paragraph: number;
    line: number;
    word: number;
  },
  'translated': {
    caption: number;
    paragraph: number;
    line: number;
    word: number;
  },
  'translatedMultiline': {
    caption: number;
    paragraph: number;
    line: number;
    word: number;
  }
}

const initIdDict = Object.freeze({
  origin: {
    caption: 0,
    line: 0,
    paragraph: 0,
    word: 0
  },
  multiline: {
    caption: 0,
    line: 0,
    paragraph: 0,
    word: 0
  },
  translated: {
    caption: 0,
    paragraph: 0,
    line: 0,
    word: 0
  },
  translatedMultiline: {
    caption: 0,
    line: 0,
    paragraph: 0,
    word: 0
  }
})

export default class IdGenerator {
  private static _idDict: IdFieldDictionary = {
    origin: {
      caption: 0,
      line: 0,
      paragraph: 0,
      word: 0
    },
    multiline: {
      caption: 0,
      line: 0,
      paragraph: 0,
      word: 0
    },
    translated: {
      caption: 0,
      paragraph: 0,
      line: 0,
      word: 0
    },
    translatedMultiline: {
      caption: 0,
      line: 0,
      paragraph: 0,
      word: 0
    }
    
  }

  /**
   * It is recommended to use this method only when initializing your project.
   * @param key 
   * @param value initializing value
   * @returns 
   */
  public static setId(
    key: keyof IdFieldDictionary,
    type: keyof IdFieldDictionary[keyof IdFieldDictionary],
    value: number
  ) {
    this._idDict[key][type] = value;
  }

  public static getNextId(
    key: keyof IdFieldDictionary,
    type: keyof IdFieldDictionary[keyof IdFieldDictionary],
  ) {
    return this._idDict[key][type]++;
  }

  public static reset(idDict?: IdFieldDictionary) {
    const ids = idDict ?? { ...initIdDict };
    (Object.keys(this._idDict) as Array<keyof IdFieldDictionary>).forEach(key => {
      (Object.keys(this._idDict[key]) as Array<keyof IdFieldDictionary[keyof IdFieldDictionary]>).forEach(type => {
        this._idDict[key][type] = ids[key][type];
      });
    });
  }
}