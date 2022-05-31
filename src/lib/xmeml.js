const timebase = 24;

function convertFontSize(fontSize) {
  if (typeof fontSize !== 'number') {
    throw new TypeError('Bottom is not number.')
  }
  return (fontSize / 100) * 24
}
function convertHoriz(left) {
  if (typeof left !== 'number') {
    throw new TypeError('Bottom is not number.')
  }
  const value = left - 50;
  return value / 100;
}
function convertVert(bottom) {
  if (typeof bottom !== 'number') {
    throw new TypeError('Bottom is not number.')
  }
  const value = 60 - bottom;
  return value / 100;
}

function CreateGeneratoritem(line, meta) {
  const lines = line.text?.trim().split('\r\n');
  const font = line.style?.font?.replace && line.style?.font?.replace(/ /gi, "")?.replace(/_TTF/g, '');
  const strs = lines?.map(lineValue => ({
    "parameterid": "str",
    "name": "Text",
    "value": lineValue
  }));

  return {
    "_attributes": {
      id: "Outline Text1"
    },
    "name": line.text,
    "duration": meta.duration * timebase,
    "rate": {
      "timebase": 1 * timebase,
      "ntsc": false
    },
    "start": line.start * timebase,
    "end": line.end * timebase,
    "in": line.start * timebase,
    "out": line.end * timebase,
    "enabled": true,
    "anamorphic": false,
    "alphatype": "black",
    "masterclipid": "Outline Text1",
    "effect": {
      "name": "Outline Text",
      "effectid": "Outline Text",
      "effectcategory": "Text",
      "effetttype": "generator",
      "mediatype": "video",
      "parameter": [
        {
          "parameterid": "part1",
          "name": "Text Settings"
        },
        ...strs,
        {
          "parameterid": "font",
          "name": "Font",
          "value": font
        },
        {
          "parameterid": "style",
          "name": "Style",
          "valuemin": "1",
          "valuemax": "1",
          "valuelist": {
            "valueentry": {
              "name": "Regular",
              "value": "1"
            }
          },
          "value": "1"
        },
        {
          "parameterid": "align",
          "name": "Alignment",
          "valuemin": "1",
          "valuemax": "3",
          "valuelist": {
            "valueentry": [
              {
                "name": "Left",
                "value": "1"
              },
              {
                "name": "Center",
                "value": "2"
              },
              {
                "name": "Right",
                "value": "3"
              }
            ]
          },
          "value": "2"
        },
        {
          "parameterid": "size",
          "name": "Size",
          "valuemin": "0",
          "valuemax": "200",
          "value": line.style.fontSize ? convertFontSize(Number.parseInt(line.style.fontSize)) : 100
        },
        {
          "parameterid": "track",
          "name": "Tracking",
          "valuemin": "0",
          "valuemax": "100",
          "value": "1"
        },
        {
          "parameterid": "lead",
          "name": "Leading",
          "valuemin": "-100",
          "valuemax": "100",
          "value": "0"
        },
        {
          "parameterid": "aspect",
          "name": "Aspect",
          "valuemin": "0",
          "valuemax": "4",
          "value": "1"
        },
        {
          "parameterid": "linewidth",
          "name": "Line Width",
          "valuemin": "0",
          "valuemax": "200",
          "value": "2"
        },
        {
          "parameterid": "linesoft",
          "name": "Line Softness",
          "valuemin": "0",
          "valuemax": "100",
          "value": "5"
        },
        {
          "parameterid": "textopacity",
          "name": "Text Opacity",
          "valuemin": "0",
          "valuemax": "100",
          "value": "100"
        },
        {
          "parameterid": "center",
          "name": "Center",
          "value": {
            "horiz": convertHoriz(line.horizontal),
            "vert": convertVert(line.vertical)
          }
        },
        {
          "parameterid": "textcolor",
          "name": "Text Color",
          "value": {
            "alpha": `${line.style?.color?.a}`,
            "red": `${line.style?.color?.r}`,
            "green": `${line.style?.color?.g}`,
            "blue": `${line.style?.color?.b}`
          }
        },
        {
          "parameterid": "supertext",
          "name": "Text Graphic"
        },
        {
          "parameterid": "linecolor",
          "name": "Line Color",
          "value": {
            "alpha": "255",
            "red": "0",
            "green": "0",
            "blue": "0"
          }
        },
        {
          "parameterid": "superline",
          "name": "Line Graphic"
        },
        {
          "parameterid": "part2",
          "name": "Background Settings"
        },
        {
          "parameterid": "xscale",
          "name": "Horizontal Size",
          "valuemin": "0",
          "valuemax": "200",
          "value": "0"
        },
        {
          "parameterid": "yscale",
          "name": "Vertical Size",
          "valuemin": "0",
          "valuemax": "200",
          "value": "0"
        },
        {
          "parameterid": "xoffset",
          "name": "Horizontal Offset",
          "valuemin": "-100",
          "valuemax": "100",
          "value": "0"
        },
        {
          "parameterid": "yoffset",
          "name": "Vertical Offset",
          "valuemin": "-100",
          "valuemax": "100",
          "value": "0"
        },
        {
          "parameterid": "backsoft",
          "name": "Back Soft",
          "valuemin": "0",
          "valuemax": "100",
          "value": "0"
        },
        {
          "parameterid": "backopacity",
          "name": "Back Opacity",
          "valuemin": "0",
          "valuemax": "100",
          "value": "50"
        },
        {
          "parameterid": "backcolor",
          "name": "Back Color",
          "value": {
            "alpha": `${line.style.background?.a}`,
            "red": `${line.style.background?.r}`,
            "green": `${line.style.background?.g}`,
            "blue": `${line.style.background?.b}`
          }
        },
        {
          "parameterid": "superback",
          "name": "Back Graphic"
        },
        {
          "parameterid": "crop",
          "name": "Crop",
          "value": "false"
        },
        {
          "parameterid": "autokern",
          "name": "Auto Kerning",
          "value": "true"
        }
      ]
    },
  }
}

export function SubtitlesToXmeml(captions, meta) {
  let name = meta.title;
  let duration = meta.duration;
  let width = meta.width;
  let height = meta.height;

  const generatoritem = captions.map(line => CreateGeneratoritem(line, meta));

  return {
    "_declaration": {
      "_attributes": {
        "version": "1.0",
        "encoding": "utf-8"
      }
    },
    "xmeml": {
      "_attributes": {
        version: 5
      },
      "sequence": {
        "_attributes": {
          id: "video"
        },
        "name": name,
        "duration": duration * timebase,
        "rate": {
          "timebase": timebase,
          "ntsc": false,
        },
        "media": {
          "video": {
            "format": {
              "samplecharacteristics": {
                "width": width,
                "height": height
              }
            },
            "track": {
              "generatoritem": generatoritem
            }
          }
        }
      }
    }
  }
}
