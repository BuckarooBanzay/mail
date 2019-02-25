Mail mod for Minetest
======

[![Build Status](https://travis-ci.org/thomasrudin-mt/mail.svg?branch=master)](https://travis-ci.org/thomasrudin-mt/mail)

This is a fork of cheapies mail mod

It adds a mail-system that allows players to send each other messages in-game and via webmail (optional)

# Screenshots

Ingame mail
![](pics/ingame.png?raw=true)

Webmail
![](pics/webmail.png?raw=true)


# Installation

## In-game mail mod

Install it like any other mod: copy the directory to your "worldmods" folder

## Webmail

The webmail component runs as webservice and provides the api for the minetest server
and the website for the webmail componentc

Prerequisites:
* node and npm (on ubuntu: apt install nodejs npm)

To install and run the webmail server:
* Copy the "webmail" folder to your desired location (or keep it where it is)
* Change to the webmail directory: (cd ./webmail)
* run "npm install" to install the node dependencies
* generate a secret key for yourself, can be anything string-like, i suggest one from https://www.random.org/passwords/?num=5&len=16&format=html&rnd=new
* Edit the "start.sh" file and insert the secret key in place of "myserverkey"
* run "./start.sh"

To set up your minetest installation to communicate with the webmail server, edit your "minetest.conf":
```
# enable curl/http on that mod
secure.http_mods = mail
# the url to the webmail server
webmail.url = http://127.0.0.1:8080
# the secret key previously generated (same as in "webmail/start.sh")
webmail.key = myserverkey

# optionally, if you have xban2 and don't want banned users to login:
webmail.disallow_banned_players = true
```

# Commands/Howto

To access your mail click on the inventory mail button or use the "/mail" command
Mails can be deleted, marked as read or unread, replied to and forwarded to another player

# Dependencies
* None

# Roadmap

My current roadmap:
* Enhance ingame UI
* Better ingame notification
* Enhance webmail component
* Allow sending attachments

# Bugs

Let me know if there are any (there are for sure:)

# License

See the "LICENSE" file

# Contributors

* Cheapie (initial idea/project)
* Rubenwardy (lua/ui improvements)

# Old/Historic stuff
* Old forum topic: https://forum.minetest.net/viewtopic.php?t=14464
* Old mod: https://cheapiesystems.com/git/mail/

