let tsId = 0;

function convertFontSize(fontSize) {
  if (typeof fontSize !== 'number') {
    throw new TypeError('The fontSize is not number.')
  }
  return (fontSize / 100) * 40;
}

function convertColor(color) {
  const { r, g, b, a } = color;

  function finalCutValue(num) {
    return (num / 255).toFixed(6)
  }
  const newR = finalCutValue(r);
  const newG = finalCutValue(g);
  const newB = finalCutValue(b);

  return `${newR} ${newG} ${newB} ${a}`;
}

function convertPosition(left, bottom) {
  if (typeof left !== 'number' || typeof bottom !== 'number') {
    throw new TypeError('The position is not number.')
  }

  let calculateLeft;
  if (left > 50) {
    calculateLeft = -(50 - left);
  } else {
    calculateLeft = left - 50;
  }

  const convertLeft = calculateLeft * 10;
  const convertBottom = (bottom - 50 - 10) * 10;
  return `${convertLeft} ${convertBottom}`;
}

function convertAdjustTransform(left, bottom) {
  if (typeof left !== 'number' || typeof bottom !== 'number') {
    throw new TypeError('The position is not number.')
  }

  const calculateLeft = left - 50;
  const calculateBottom = bottom - 50;

  return `${calculateLeft} ${calculateBottom}`;
}

function convertShadowColor(outline, outlineColor) {
  let value = undefined;

  if (outline === 1 || outline === 2 || outline === 4) {
    value = outlineColor;
  }

  return value;
}

function convertShadowOffset(outline) {
  let value = undefined;

  if (outline === 1) {
    value = "14.7 315";
  } else if (outline === 2) {
    value = "5 150";
  } else if (outline === 4) {
    value = "12 315";
  }

  return value;
}

function CreateTextStyle(ref, text) {
  return {
    "_attributes": {
      "ref": ref
    },
    "_text": text
  }
}

function CreateTitle(line, format) {
  const data = {
    start: Math.floor(line.start * 24),
    offset: Math.floor(line.start * 24),
    duration: Math.floor((line.end - line.start) * 24),
    name: line.text,
    text: line.text,
    style: { ...line.style },
    horizontal: line.horizontal,
    vertical: line.vertical
  }

  const id = tsId++;

  const outline = data.style.outline;
  const outlineColor = data.style.outlineColor && convertColor(data.style.outlineColor);

  let title = {
    "_attributes": {
      "start": `${data.start}/24s`,
      "lane": "1",
      "offset": `${data.offset}/24s`,
      "ref": "r2",
      "duration": `${data.duration}/24s`,
      "name": data.name
    },

    "param": {
      "_attributes": {
        "name": "Position",
        "key": "9999/999166631/999166633/1/100/101",
        "value": convertPosition(data.horizontal, data.vertical)
      },
    },

    "text": {
      "text-style": CreateTextStyle(`ts${id}`, data.text)
    },
    "text-style-def": {
      "_attributes": {
        "id": `ts${id}`
      },
      "text-style": {
        "_attributes": {
          "font": format === "Resolve" ? data.style.font : 'Apple SD Gothic Neo',
          "fontSize": data.style.fontSize ? convertFontSize(data.style.fontSize) : 100,
          "fontColor": convertColor(data.style.color),
          "bold": data.style.bold ? "1" : "0",
          "italic": data.style.italic ? "1" : "0",
          "shadowColor": convertShadowColor(outline, outlineColor),
          "shadowOffset": convertShadowOffset(outline),
          "strokeColor": outline === 3 ? outlineColor : undefined,
          "strokeWidth": outline === 3 ? "3" : undefined,
          "shadowBlurRadius": outline === 4 ? "8" : undefined
        }
      }
    },
  }

  if (format === "Resolve") {
    title = {
      ...title,
      "adjust-conform": {
        "_attributes": {
          "type": "fit"
        }
      },
      "adjust-transform": {
        "_attributes": {
          "position": convertAdjustTransform(data.horizontal, data.vertical),
          "scale": "1 1",
          "anchor": "0 0"
        }
      }
    }
  }

  return title;
}

function CreateSpine(captions, format) {
  return captions.map(line => {
    return CreateTitle(line, format);
  })
}

export function ProjectToFcpxml(captions, meta) {
  const projectName = "SUBTITLES";
  const { duration, width, height, format } = meta;

  const output = {
    "_declaration": {
      "_attributes": {
        "version": "1.0",
        "encoding": "UTF-8"
      }
    },
    "_doctype": "fcpxml",
    "fcpxml": {
      "_attributes": {
        "version": "1.6"
      },
      "import-options": {
        "option": {
          "_attributes": {
            "key": "suppress warnings",
            "value": "1"
          }
        }
      },
      "resources": {
        "format": {
          "_attributes": {
            "id": "r1",
            "height": height,
            "frameDuration": "1/24s",
            "width": width
          }
        },
        "effect": {
          "_attributes": {
            "id": "r2",
            "uid": ".../Titles.localized/Bumper:Opener.localized/Basic Title.localized/Basic Title.moti",
            "name": "Basic Title"
          }
        }
      },
      "library": {
        "event": {
          "_attributes": {
            "name": projectName
          },
          "project": {
            "_attributes": {
              "name": projectName
            },
            "sequence": {
              "_attributes": {
                "tcStart": "0s",
                "tcFormat": "NDF",
                "format": "r1",
                "duration": `${Math.ceil(duration * 24)}/24s`
              },
              "spine": {
                "gap": {
                  "_attributes": {
                    "name": "Gap",
                    "offset": "0s",
                    "duration": `${Math.ceil(duration * 24)}/24s`,
                    "start": "0s",
                  },
                  "title": CreateSpine(captions, format)
                }
              }
            }
          }
        }
      }
    }
  }
  tsId = 0;
  return output;
}
