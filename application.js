/* eslint-disable max-len */
'use strict';

import inquirer from 'inquirer';
import publicIP from 'public-ip';
import chalk from 'chalk';
import moment from 'moment';

import configs from './configs';
import lastUpdate from './lastupdate';
import updater from './updater';
import log from './log';

class Application {
  run() {
    log.println(chalk.green.bold('+-----------------------------------+'));
    log.println(chalk.green.bold('|      Registro.br DNS Updater      |'));
    log.println(chalk.green.bold('+-----------------------------------+'));
    log.println(chalk.green.bold(' by evsar3                     v2.0.3\n'));

    log.print('Acquiring your public IP...');

    publicIP.v4().then(myPublicIP => {
      log.updateln(`Your public IP is ${chalk.green.bold(myPublicIP)}`);
      log.println(`Your last IP update was ${moment(lastUpdate.dateTime).fromNow()} at ${moment(lastUpdate.dateTime).format('L LTS')}`);

      if (!lastUpdate.compare(myPublicIP) || process.argv.includes('--force')) {
        log.println(`${chalk.red('Your network has changed. Your old IP was')} ${chalk.red.bold(lastUpdate.previousIP)}`);

        log.println('Proceed to host name updates');

        configs.accounts.forEach(async account => {
          log.println(`Updating host names for ${chalk.green.bold(account.userName)}...`);

          account.domains.forEach(async domain => {
            domain.records.forEach(record => {
              log.println(`  • ${chalk.blue(record + '.' + domain.name)}`);
            });
          });

          log.print(chalk.yellow('  * Wait...'));

          await updater(account, myPublicIP, {
            headless: !process.argv.includes('--no-headless')
          });

          log.updateln(chalk.green('  ✓ Done.'));

          lastUpdate.setUpdate(myPublicIP);
        });
      } else {
        log.println(chalk.green.bold('No network change detected. Bye'));
      }
    });
  }

  addAccount() {
    let questions = [
      {
        type: 'input',
        name: 'userName',
        message: 'User Name:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:'
      }
    ];

    inquirer.prompt(questions).then(answers => {
      if (answers.userName === '' || answers.password === '') {
        log.lnprint('Canceled.');
        return false;
      }

      configs.addAccount(answers.userName, answers.password).save();

      log.lnprint('Account successfully saved.');
    });
  }

  addDomain() {
    let accounts = [];

    configs.accounts.forEach(a => accounts.push(a.userName));

    accounts.sort();

    accounts.push(new inquirer.Separator());

    accounts.push('Cancel');

    let questions = [
      {
        type: 'input',
        name: 'fqdn',
        message: 'FQDN:'
      },
      {
        type: 'list',
        choices: accounts,
        name: 'userName',
        message: 'Which account this domain belongs to?'
      },
    ];

    inquirer.prompt(questions).then(answers => {
      if (answers.fqdn === '' || answers.userName === 'Cancel') {
        log.lnprint('Canceled.');
        return false;
      }

      // eslint-disable-next-line max-len
      configs.addRecord(answers.userName, this.__parseFqdn(answers.fqdn)).save();

      log.lnprint('Domain successfully added.');
    });
  }

  removeAccount() {
    let list = [];

    configs.accounts.forEach(a => list.push(a.userName));

    list.sort();

    list.push(new inquirer.Separator());

    list.push('Cancel');

    inquirer.prompt([
      {
        type: 'list',
        choices: list,
        name: 'userName',
        message: 'Pick an account to remove:'
      }
    ]).then(answers => {
      if (answers.userName === 'Cancel') {
        log.lnprint('Canceled.');
        return false;
      }

      configs.removeAccount(answers.userName).save();

      log.lnprint('Account successfully removed.');
    });
  }

  removeDomain() {
    let domains = [];

    configs.accounts.forEach(account => {
      account.domains.forEach(domain => {
        domains.push(`*.${domain.name}`);

        domain.records.forEach(record => {
          domains.push(`${record}.${domain.name}`);
        });
      });
    });

    domains.push(new inquirer.Separator());

    domains.push('Cancel');

    inquirer.prompt([
      {
        type: 'list',
        choices: domains,
        name: 'fqdn',
        message: 'Pick a domain to remove:'
      }
    ]).then(answers => {
      if (answers.fqdn === 'Cancel') {
        log.lnprint('Canceled.');
        return false;
      }

      configs.removeRecord(this.__parseFqdn(answers.fqdn)).save();

      log.lnprint('Domain successfully removed.');
    });
  }

  list() {
    configs.accounts.forEach(account => {
      log.lnprint(account.userName);

      account.domains.forEach(domain => {
        domain.records.forEach(record => {
          log.lnprint(`⤷ ${record}.${domain.name}`);
        });
      });
    });
  }

  createCronJob() {}

  removeCronJob() {}

  __parseFqdn(fqdn) {
    if (fqdn.substr(-1) === '.') {
      fqdn = fqdn.substr(0, fqdn.length - 1);
    }

    return fqdn;
  }
}

export default new Application();
