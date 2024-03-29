# :warning: *Deprecation notice* :warning:

This project is now being replaced by the `mtui` project here: https://github.com/minetest-go/mtui

It only serves as a public archive at this point

Mail mod for Minetest (webmail component)
======

![](https://github.com/minetest-mail/mail/workflows/jshint_backend/badge.svg)
![](https://github.com/minetest-mail/mail/workflows/jshint_frontend/badge.svg)
![](https://github.com/minetest-mail/mail/workflows/integration-test/badge.svg)
![](https://github.com/minetest-mail/mail/workflows/docker/badge.svg)

This is the webmail component for the minetest mail mod

The ingame mod lives here: https://github.com/minetest-mail/mail_mod

# Screenshots

Ingame mail
![](pics/ingame.png?raw=true)

Webmail
![](pics/webmail.png?raw=true)


# Installation

The webmail component runs as webservice and provides the api for the minetest server
and the website for the webmail component

## Bare metal

Prerequisites:
* node and npm (on ubuntu: apt install nodejs npm)

To install and run the webmail server:
* run "npm install" to install the node dependencies
* generate a secret key for yourself, can be anything string-like, i suggest one from https://www.random.org/passwords/?num=5&len=16&format=html&rnd=new
* Edit the "start.sh" file and insert the secret key in place of "myserverkey"
* run "./start.sh"

## Docker

```bash
sudo docker run --rm -it -p 8080:8080 -e WEBMAILKEY=myserverkey minetestmail/mail
```

# Mod configuration

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


# Roadmap

The current roadmap:
* Enhance ingame UI
* Better ingame notification
* Enhance webmail component
* Allow sending attachments

# Bugs

Let me know if there are any (there are for sure:)

# License

See the "LICENSE" file
