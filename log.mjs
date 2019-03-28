'use strict';

class Log {
  constructor(options = {}) {
    options = {...{
      verbose: true,
      file: true,
      filePath: './.log.log'
    }, options};

    this.options = options;
  }

  print(message) {
    if (!process.argv.includes('--silent')) {
      process.stdout.write(message);
    }
  }

  println(message) {
    this.print(message + '\n');
  }

  lnprint(message) {
    this.print('\n' + message);
  }

  lnprintln(message) {
    this.print('\n' + message + '\n');
  }

  update(message) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    this.print(message);
  }

  updateln(message) {
    this.update(message + '\n');
  }
}

export default new Log();
