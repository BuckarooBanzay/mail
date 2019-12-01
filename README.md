Mail mod for Minetest (webmail component)
======

This is the webmail component for the minetest mail mod

The ingame mod lives here: https://github.com/minetest-mail/mail_mod

# Screenshots

Ingame mail
![](pics/ingame.png?raw=true)

Webmail
![](pics/webmail.png?raw=true)


# Installation

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

# Docker image

```bash
sudo docker run --rm -it -p 8080:8080 -e WEBMAILKEY=myserverkey minetestmail/mail
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
