# Registro.br DNS Updater
Registro.br Updater helps you to update DNS records on brazilian registrar's DNS servers. This tool works like **No-IP** or **DynDNS** services, updating previous configured DNS records to your dynamic IP.

## Installation & setup
`$ npm install -g registrobrupdater`

### Add an account
`$ registrobrupdater add-account`

Enter the informations asked or leave any input blank to cancel.

> Note: For now, your username and password are stored in a JSON file as plain text. If there is any concern about your credentials security, dont use this package.

### Add a domain record to be dynamically updated
`$ registrobrupdater add-domain`

Enter the [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) of the domain. Eg. my.domain.com  
Select the account that owns the domain.

> You should first create the DNS record on Registro.br's DNS editor tool  
> [Follow this steps to achive it](#create-dns-record-on-registrobr)

### Remove an account
`$ registrobrupdater remove-account`

Select the account you want to delete and press enter.

### Remove a domain
`$ registrobrupdater remove-domain`

Select the domain name you want to delete and press enter.

### List accounts and domains
`$ registrobrupdater list`

List accounts and domains in your config file.

## Usage
`$ registrobrupdater`

The program will run the DNS update process for each of your accounts and domains.

### Options

#### `--force`
Run the update process even if the IP is already updated.

#### `--silent`
Doesn't print anything on screen.

#### `--no-headless`
Shows the Chromium browser while perform the updates.

# Create DNS record on Registro.br
* **Log-in** into your control panel at Registro.br's website;
* **Select the domain** you want to edit DNS records;
* At the domain details page click on _**'EDITAR ZONA'**_;
* Now click on _**'NOVA ENTRADA'**_;
* **Pick a name** for your DNS record;
* On the dropdown, select type **A**;
* On _**'Endereço de IP'**_ field put **any IP address**. This will be dynamically updated by this tool when it runs;
* Click at _**'ADICIONAR'**_;
* Click at _**'SALVAR'**_;
* Done.

# License - MIT

Copyright 2019. Evandro Araújo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
