
# Communication objects

* JSON-RPC V1 (See: https://en.wikipedia.org/wiki/JSON-RPC)
* POST to Webmail
* GET Long-poll to Webmail


## Data types

### Mail
Generic mail data

```json
{
	"sender": "source name",
	"receiver": "destination name",
	"subject": "subject line",
	"body": "mail body",
  "time": 1551258349,
	"attachments": ["default:stone 99", "default:gold_ingot 99"]
}
```


## Exchanged Data

### New mail from in-game (MT -> Webmail)
```js
{
  "method": "new-message",
  "params": { /* Mail Data */ }
}
```

### Authorization (Webmail -> MT)

Request:
```json
{
  "method": "auth",
  "id": 42,
  "params": {
    "playername": "xy",
    "password": "1234"
  }
}
```

Response:
```json
{
  "method": "auth",
  "id": 42,
  "result": {
    "success": true,
    "message": null
  }
}
```

### Get player mails (Webmail -> MT)


Request:
```json
{
  "method": "get-mails",
  "id": 55,
  "params": {
    "playername": "abcd"
  }
}
```

Response:
```js
{
  "method": "get-mails",
  "id": 55,
  "result": [{ /* Mail Data */ }]
}
```

### Mark read/unread (Webmail -> MT)

Request:
```json
{
  "method": "mark-mail-read",
  "id": 66,
  "params": {
    "playername": "abcd",
    "index": 1,
    "subject": "the subject",
    "read": true
  }
}
```

Response:
```json
{
  "method": "mark-mail-read",
  "id": 66,
  "result": {
    "success": true
  }
}
```

### Delete mail (Webmail -> MT)

Request:
```json
{
  "method": "delete-mail",
  "id": 77,
  "params": {
    "playername": "abcd",
    "index": 1,
    "subject": "the subject"
  }
}
```

Response:
```json
{
  "method": "delete-mail",
  "id": 77,
  "result": {
    "success": true
  }
}
```

### Send mail (Webmail -> MT)

Request:
```js
{
  "method": "send-mail",
  "id": 88,
  "params": { /* Mail Data */ }
}
```

Response:
```json
{
  "method": "send-mail",
  "id": 88,
  "result": {
    "success": true
  }
}
```
