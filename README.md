# Shift Webmonitor ( Web Version / [Server Version](https://github.com/MxShift/shift-monitor) )
Tool to watch your servers status. Height, Consensus and Forging status. Next turn and last forged block time.

## Requisites

* You can install this script on your server or **upload it to any web hosting including Phantom**;
* Make sure you **whitelist all your IPs** in API and Forging sections of Shift *config.json* in all servers;

## Installation
Download all files to your computer.

Then you need to edit **config.json** file with all your proper data. You can use it for Mainnet and Testnet both or only for Mainnet.

> "m_name" **// Mainnet delagate username;**

> "t_name" **// Testnet delagate username;**

> "m_publicKey" **// Mainnet publicKey;**

> "t_publicKey" **// Testnet publicKey;**

>  "servers" **// It's an array of all the servers you will monitor.**

>  "server1" **// Server number;**

>  "name" **// Your server's name;**

>  "http" **// Your server's connection;**
      
>  "ip" **// Your server's ip or domain;**
       
>  "port" **// Your server's Shift port;**
      
>  "testnet" **// 'true' for Testnet servers, 'false' for Mainnet servers;**

<br>
 
After you finish and save your changes from **config.json**, 

**you can upload all files (except webserver.js) to any web hosting including Phantom.**

If you access from a device that you have in your servers whitelist, you will be able to obtain almost realtime data.

### Browser notifications are works perfectly with Firefox Desktop and Mobile browsers.

## Chromium based browsers
For using with Chromium based browsers you should use a secure **https** connection for recieving notifications. You can enabled it in **config.json**:

>  "ssl": {

>  "enabled" **// 'true' for https support;**

>  "options": {

>  "port" **// port for https connection;**
 
>  "key" **// your SSL private key;**
  
>  "cert" **// your SSL certificate;**

<br>

Or you can start your Chromium based browser with this key:

```
--user-data-dir=/tmp/foo --unsafely-treat-insecure-origin-as-secure=http://serverip:serverport/
```

*Notifications are not supported by Chromium based Mobile browsers.*

## Output example

![Screenshot must be right here](https://github.com/MxShift/shift-monitor/blob/master/resources/Screenshot.png?raw=true "Screenshot")
