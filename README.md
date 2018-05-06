# Shift Monitor
Tool to watch your servers status. Height, Consensus and Forging status. Next turn and last forged block time.

<br>

## Requisites

* You need to have Shift installed;
* Install this script only in one server and make sure you whitelist your IP in all servers;
* You need to have [fs, http, https, node-cmd, path] installed in npm, for example: npm install node-cmd;
* Make sure to add your new serverport numbers to your firewall. [ShiftProject Wiki](https://www.reddit.com/r/ShiftProject/wiki/guides/delegate#wiki_step_seven_.2014_set_up_a_basic_firewall);

## Installation
You need to edit config.json file with all your proper data. The structure is as follows:

> "m_name" **// Mainnet delagate username;**

> "t_name" **// Testnet delagate username;**

> "m_publicKey" **// Mainnet publicKey;**

> "t_publicKey" **// Testnet publicKey;**

> "serverip" **// IP of the server where you are installing this software;**

> "serverport" **// It's the port of your server for the Shift Monitor. Must be different from the ports that Shift uses;**

>  "servers" **// It's an array of all the servers you will monitor.**

>  "server1"

>  "name"

>  "http"
      
>  "ip"
      
>  "port"
      
>  "testnet" **// 'true' for Testnet servers, 'false' for Mainnet servers;**
 
After you finish and save your changes from **config.json**, 
run in a background process (you can use screen): 
`node webserver.js`

<i>node webserver.js</i> will start a web server which you can access with http://serverip:serverport/ from a web browser like Chrome.<br>
If you access from a device that you have in your servers whitelist, you will be able to obtain almost realtime data.<br>
If you access from a device that is no in your servers whitelist, you will obtain the data with a delay of 20 seconds maximum.<br><br>

Optimum method of use. If you are in your office or home computer whitelist that IP's and open chrome on your server's address, you will not need to check everytime how your servers are performing, chrome will alert you if none of your servers are forging. When the page load is complete you will recieve a first alert to test and for you to see how it works.<br><br>

>  "ssl": {

>  "enabled" **// 'true' for https support;**

>  "options": {

>  "port" **// port for https connection;**
 
>  "key" **// your SSL private key;**
  
>  "cert" **// your SSL certificate;**

### Output example

![Screenshot must be right here](https://github.com/MxShift/shift-monitor/blob/master/resources/Screenshot.png?raw=true "Screenshot")
