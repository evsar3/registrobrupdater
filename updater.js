'use strict';

import puppeteer from 'puppeteer';

const definitions = {
  urls: {
    login: 'https://registro.br/login'
  },

  pageTitles: {
    loginPage:         'Acessar conta - Registro.br',
    mainPage:          'Domínios - Painel Registro.br',
    domainDetailsPage: 'Registro.br',
    dnsEditorPage:     'FreeDNS'
  },

  pageElements: {
    loginPage: {
      formUserNameField: 'input[type="text"][name="login.user"]',
      formPasswordField: 'input[type="password"][name="login.password"]',
      formSubmitButton:  'button.bt',
    },

    mainPage: {
      domainDetailsButton: 'a.link[href$="{domain}"]'
    },

    domainDetailsPage: {
      dnsEditorButton: 'a.edit-config[href*="freedns"]'
    },

    dnsEditorPage: {
      recordTableRow:                    'tr:contains("{record}.{domain}")',
      recordRemoveButton:                'a.remove_rr[title="Remover record"]',
      addRecordButton:                   '#new-rr-button',
      addRecordFormRecordNameField:      '#add-rr-ownername',
      addRecordFormRecordTypeField:      '#add-rr-type',
      addRecordFormRecordIPAddressField: '#add-rr-a',
      addRecordFormSubmit:               '#add-button',
      saveChangesButton:                 'input[type="submit"]'
    }
  }
};

function Updater(account, ip, options = {}) {
  return new Promise(resolve => {

    account.domains.forEach(domain => {
      puppeteer.launch(options).then(async browser => {
          const page = await browser.newPage();

          let finished = false;

          page.setDefaultNavigationTimeout(20000);
          page.goto(definitions.urls.login);

          page.on('domcontentloaded', () => {
            if (finished) {
              resolve();

              browser.close();

              return;
            }

            page.title().then(title => {
              switch (title) {
                case definitions.pageTitles.loginPage:
                  page.waitForSelector(
                    definitions.pageElements.loginPage.formUserNameField
                  ).then(async () => {

                    await page.focus(definitions.pageElements
                      .loginPage.formUserNameField);
                    await page.keyboard.type(account.userName);

                    await page.focus(definitions.pageElements
                      .loginPage.formPasswordField);
                    await page.keyboard.type(account.password);

                    await page.evaluate(elements => {

                      document.querySelector(
                        elements.formSubmitButton).click();

                    }, definitions.pageElements.loginPage);

                  });

                  let domainDetailsButton =
                    definitions.pageElements.mainPage.domainDetailsButton
                      .replace('{domain}', domain.name);

                  page.waitForSelector(domainDetailsButton).then(() => {

                    page.evaluate(domainDetailsButton => {
                      document.querySelector(
                        domainDetailsButton).click();

                    }, domainDetailsButton);

                  });

                  break;

                case definitions.pageTitles.domainDetailsPage:
                  page.evaluate(elements => {

                    document.querySelector(
                      elements.dnsEditorButton).click();

                  }, definitions.pageElements.domainDetailsPage);

                  break;

                case definitions.pageTitles.dnsEditorPage:
                  page.evaluate((elements, domain, ip) => {

                    domain.records.forEach(record => {
                      let rr = elements.recordTableRow
                        .replace('{record}', record)
                        .replace('{domain}', domain.name);

                      $(rr).find(elements.recordRemoveButton)[0].click();

                      document.querySelector(elements.addRecordButton).click();

                      document.querySelector(
                        elements.addRecordFormRecordNameField).value = record;

                      document.querySelector(
                        elements.addRecordFormRecordTypeField).value = 'A';

                      document.querySelector(
                        elements.addRecordFormRecordIPAddressField).value = ip;

                      document.querySelector(
                        elements.addRecordFormSubmit).click();

                      document.querySelector(
                        elements.saveChangesButton).click();
                    });

                  }, definitions.pageElements.dnsEditorPage, domain, ip);

                  finished = true;

                  break;
              }
          });
        });
      });
    });
  });
}

export default Updater;
