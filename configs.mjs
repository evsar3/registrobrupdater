'use strict';

import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.resolve(__dirname, './.configs.json');

class Configs {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.preferences = Object.create({});
    this.accounts = [];

    return this.load();
  }

  load() {
    if (!fs.existsSync(this.configFilePath)) {
      fs.writeFileSync(this.configFilePath, JSON.stringify({
          preferences: this.preferences,
          accounts: this.accounts
      }, null, 2));
    }

    let configs = JSON.parse(fs.readFileSync(this.configFilePath));

    this.preferences = configs.preferences;
    this.accounts = configs.accounts;

    return this;
  }

  reload() {
    return this.load();
  }

  save() {
    let configs = {
      preferences: this.preferences,
      accounts: this.accounts
    };

    fs.writeFileSync(this.configFilePath, JSON.stringify(configs, null, 2));
  }

  addAccount(userName, password) {
    this.accounts.push({
        userName: userName.toUpperCase(),
        password,
        domains: []
    });

    return this;
  }

  addDomain(userName, fqdn) {
    let domainExists = this.accounts.find(a => a.userName === userName)
      .domains.find(a => a.name === fqdn);

    if (domainExists) {
      return this;
    }

    this.accounts.find(a => a.userName === userName)
      .domains.push({
        name: fqdn,
        records: []
      });

    return this;
  }

  addRecord(userName, fqdn) {
    let parsedFqdn = this.__parseFqdn(fqdn);

    this.addDomain(userName, parsedFqdn.domain);

    this.accounts.find(a => a.userName === userName)
      .domains.find(a => a.name === parsedFqdn.domain)
      .records.push(parsedFqdn.record);

    return this;
  }

  removeAccount(userName) {
    this.accounts = this.accounts.filter(a => a.userName !== userName);

    return this;
  }

  removeDomain(fqdn) {
    this.accounts.forEach(account => {
      account.domains = account.domains.filter(a => a.name !== fqdn);
    });

    return this;
  }

  removeRecord(fqdn) {
    let parsedFqdn = this.__parseFqdn(fqdn);

    if (parsedFqdn.record === '*') {
      this.removeDomain(parsedFqdn.domain);
    }

    this.accounts.forEach(account => {
      account.domains.forEach(domain => {

        if (domain.name === parsedFqdn.domain) {
          domain.records.forEach(record => {

            if (record === parsedFqdn.record) {
              domain.records.splice(domain.records.indexOf(record), 1);

              if (domain.records.length === 0) {
                this.removeDomain(domain.name);
              }
            }

          });
        }

      });
    });

    return this;
  }

  __parseFqdn(fqdn) {
    let domainSepIndex = fqdn.indexOf('.');

    let record = fqdn.substr(0, domainSepIndex);
    let domain = fqdn.substr(domainSepIndex + 1);

    return {
      record,
      domain
    };
  }
}

export default new Configs(CONFIG_FILE);
