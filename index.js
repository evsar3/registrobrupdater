'use strict';

import application from './application';

var cmd = process.argv[2];

switch (cmd) {
  case 'add-account':
    application.addAccount();
    break;

  case 'add-domain':
    application.addDomain();
    break;

  case 'remove-account':
    application.removeAccount();
    break;

  case 'remove-domain':
    application.removeDomain();
    break;

  case 'list':
    application.list();
    break;

  case 'create-cronjob':
    break;

  case 'remove-cronjob':
    break;

  default:
    application.run();
}
