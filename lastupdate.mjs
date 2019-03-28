'use strict';

import fs from 'fs';
import path from 'path';

const LAST_UPDATE_FILE = path.resolve(__dirname, './.lastupdate.json');

class LastUpdate {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;

    return this.load();
  }

  load() {
    if (!fs.existsSync(this.configFilePath)) {
      fs.writeFileSync(this.configFilePath, JSON.stringify({
        dateTime: null,
        previousIP: null,
        currentIP: null
      }, null, 2));
    }

    const data = JSON.parse(fs.readFileSync(this.configFilePath));

    this.dateTime = data.dateTime;
    this.previousIP = data.previousIP;
    this.currentIP = data.currentIP;

    return this;
  }

  reload() {
    return this.load();
  }

  setUpdate(newIP) {
    fs.writeFileSync(this.configFilePath, JSON.stringify({
      dateTime: new Date().toISOString(),
      previousIP: this.currentIP,
      currentIP: newIP
    }, null, 2));

    return this;
  }

  compare(newIP) {
    return newIP === this.currentIP;
  }
}

export default new LastUpdate(LAST_UPDATE_FILE);
