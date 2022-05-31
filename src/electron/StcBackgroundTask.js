Object.defineProperty(exports, "__esModule", {
  value: true
});

const _downcap = require('./DowncapService').default;
const SttTaskStatus = require('./SttTaskStatus').default;
const IpcChannels = require('../IpcChannels').default;

class StcBackgroundTask {
  constructor(event) {
    this.isBreak = false;
    this.timerId = null;
    this.taskId = null;
    this.event = event;
  }

  /**
   * 
   * @param {import('models/SttAnalsisResponseModel').SttAnalsisResponseModel} response 
   */
  Start(response) {
    if (response === null || response === undefined) {
      throw new TypeError("response is not SttAnalsisResponseModel")
    }
    this.taskId = response.requsetId;
    const sttTasks = response.taskIds;

    let next = null;
    for (let index = sttTasks.length - 1; index >= 0; index--) {
      const now = sttTasks[index];
      const task = {
        now: now,
        next: next
      };
      next = task;
    }

    this.BackgroundTaskAsync(next);
  }

  Stop() {
    this.isBreak = true;
    clearTimeout(this.timerId);
  }

  async BackgroundTaskAsync(task) {
    if (this.isBreak) {
      clearTimeout(this.timerId);
      return;
    }

    const taskResult = await _downcap.GetSttTaskAsync(task.now);

    if (this.isBreak) {
      clearTimeout(this.timerId);
      return;
    }

    switch (taskResult.status) {
      case SttTaskStatus.Ready:
      case SttTaskStatus.Pending:
        this.timerId = setTimeout(() => this.BackgroundTaskAsync(task), 5000);
        break;
      case SttTaskStatus.Successed:
        this.event.reply(IpcChannels.listenSttResultReceive, {
          isLast: task.next === null,
          data: taskResult.result
        });

        if (task.next !== null) {
          this.timerId = setTimeout(() => this.BackgroundTaskAsync(task.next), 5000);
        }
        break;
      case SttTaskStatus.Canceled:
        break;
      default:
        console.error(taskResult);
        throw new Error("Unknown error occurred");
    }
  }
}

exports.default = StcBackgroundTask;
