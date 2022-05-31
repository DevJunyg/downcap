//@ts-check

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.ToFlac = ToFlacAsync;
exports.ToWave = ToWaveAsync;
exports.RenderCaption = renderCaption;
exports.FFmpegAsync = FFmpegPureAsync;

const util = require('util');
const pathManager = require('./PathManager');
const fs = require('fs');
const url = require('url');

const fsUnlinkAsync = util.promisify(fs.unlink);
const fsCopyFileAsync = util.promisify(fs.copyFile);

const LoggerFactoryHelper = require('./logging/LoggerFactoryHelper').default;
const IpcChannels = require('../IpcChannels').default;
const { padEnd } = require('lodash');
const logger = LoggerFactoryHelper.Build('FFmpegHelper');

const ffmpegPath = pathManager.FFmpeg;

/**
 * 
 * @param {string} cmd 
 */
async function FFmpegPureAsync(cmd) {
  const exec = util.promisify(require('child_process').exec);
  const {
    stdout,
    stderr
  } = await exec(`"${ffmpegPath}" -loglevel warning -y ${cmd}`, { maxBuffer: 1024 * 102400 });
  if (stdout) logger.logWarning(stdout);
  if (stderr) logger.logError(stderr);
}

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @param {string} option 
 * @returns 
 */
const FFmpegAsync = (input, output, option) => {
  return FFmpegPureAsync(`-i "${input}" ${option} "${output}"`)
}

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @returns 
 */
function ToWaveAsync(input, output) {
  return FFmpegAsync(input, output, "-acodec pcm_s16le -ac 1 -ar 16000");
}

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @returns 
 */
function ToFlacAsync(input, output) {
  return FFmpegAsync(input, output, "-c:a flac -compression_level 12 -exact_rice_parameters 1");
}

/**
 * 
 * @param {string} time 
 * @returns 
 */
function totalSeconds(time) {
  const parts = time.split(':');
  const hoursToSecond = parseInt(parts[0]) * 3600;
  const MinToSecond = parseInt(parts[1]) * 60;
  const seconds = Math.ceil(parseInt(parts[2]))
  return hoursToSecond + MinToSecond + seconds
}

/**
 * 
 * @param {*} event 
 * @param {import('models/IOutputRenderModel').IOutputRenderModel} renderModel 
 */
async function tempFileMoveAsync(event, renderModel) {

  const tempPath = renderModel.tempPath;
  const outputPath = renderModel.outputPath;
  let copyFileDone = true;

  try {
    await fsCopyFileAsync(tempPath, outputPath);
  } catch (err) {
    if (err) {
      logger.logWarning(JSON.stringify(err));
    }
    event.reply(IpcChannels.listenVideoExportError, "INVALID_URL_PATH");
    copyFileDone = false;
  }

  try {
    await fsUnlinkAsync(renderModel.tempPath);
  } catch (err) {
    err instanceof Error && logger.logWarning(err);
  }

  return copyFileDone;
}
/**
 * 
 * @param {{path: string}} origin 
 * @returns 
 */

function parseOriginPath(origin) {
  let originPathArr = origin.path.split('#');
  originPathArr[0] = url.fileURLToPath(originPathArr[0]);
  return originPathArr.join('#');
}

/**
 * 
 * @param {object} option
 * @param {string} option.input
 * @param {string} option.output
 * @param {string} [option.bitrate]
 * @param {string} [option.assPath]
 * @param {'quiet' | 'panic' | 'fatal' | 'error' | 'warning' | 'info' | 'verbose' | 'debug' | 'trace'} [option.loglevel]
 * @returns {string[]}
 */
function renderCaptionOptionBuild(option) {
  if (!option.input) {
    throw new Error();
  }

  if (!option.output) {
    throw new Error();
  }

  /** @type {string[]} */
  let args = [];

  if (option.loglevel) {
    args = ['-loglevel', option.loglevel];
  }

  args = [...args, '-i', `${option.input}`, '-y'];

  if (option.bitrate) {
    args = [...args, '-b:v', `${option.bitrate}`];
  }

  if (option.assPath) {
    args = [...args, '-vf', `ass='${option.assPath}'`];
  }

  return [...args, `${option.output}`];
}

/**
 * 
 * @param {*} event 
 * @param {import('models/IOutputRenderModel').IOutputRenderModel} renderModel 
 */
function renderCaption(event, renderModel) {
  const { origin, assPath, outputPath, tempPath } = renderModel;

  event.reply(IpcChannels.listenVideoExportStart, true);
  const renderingPath = tempPath === undefined ? outputPath : tempPath;

  const path = require('path');
  const assDirPath = assPath && path.dirname(assPath)
  const assName = assPath && path.basename(assPath);

  const cmd = renderCaptionOptionBuild({
    input: parseOriginPath(origin),
    output: renderingPath,
    assPath: assName,
    bitrate: '10M'
  });

  const ffmpeg = require('child_process').spawn(ffmpegPath, cmd, {
    cwd: assDirPath
  });

  let duration = Infinity;
  ffmpeg.stderr.on('data', /** @param {Buffer} data */(data) => {
    if (data.indexOf('Input #0') === 0) {
      const properties = String(data).split(require('os').EOL).find(line => line.trimStart().indexOf('Duration') === 0)?.split(',');
      if (properties === undefined) {
        throw new Error("Failed to find video meta information.");
      }

      let [label, hour, min, secAndmillis] = properties[0].split(':')
      let [sec, millis] = secAndmillis.split('.');
      duration = Number.parseInt(hour) * 3600
        + Number.parseInt(min) * 60
        + Number.parseInt(sec)
        + Number.parseInt(padEnd(millis, 3, '0')) / 1000;
    }

    if (data.indexOf('frame=') === 0) {
      const [
        frameLabel, frame,
        fpsLabel, fps,
        qualityLabel, quality,
        sizeLabel, size,
        timeLabel, time,
        bitrateLabel, bitrate,
        speedLabel, speed
      ] = String(data).split('=').map(str => str.trim().split(' ')).flat();

      let [hour, min, secAndmillis] = time.split(':')
      let [sec, millis] = secAndmillis.split('.');
      let t = Number.parseInt(hour) * 3600
        + Number.parseInt(min) * 60
        + Number.parseInt(sec)
        + Number.parseInt(padEnd(millis, 3, '0')) / 1000;

      event.reply(IpcChannels.listenVideoExportPercentage, Math.ceil((t / duration) * 1000) / 10);
    }
  });

  ffmpeg.on('close', async (code) => {
    if (code !== 0) {
      logger.logError(`Rendering failure code: ${code}`);
      event.reply(IpcChannels.listenVideoExportError, code === 1 ? "INVALID_URL_PATH" : "FFMPEG_ERROR");
    }

    let copyFileDone = true;
    if (fs.existsSync(renderModel.tempPath)) {
      copyFileDone = await tempFileMoveAsync(event, renderModel);
    }

    if (assPath && fs.existsSync(assPath)) {
      await fsUnlinkAsync(assPath);
    }

    event.reply(IpcChannels.listenVideoExportEnd, !copyFileDone);
  });

  return ffmpeg;
}
