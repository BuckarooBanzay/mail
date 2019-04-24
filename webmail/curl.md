
## GET

```bash
curl -H "Authorization: NHHxlCUMCrXfVQYZ" "http://127.0.0.1:8080/api/channel"
```

## POST

```bash
curl -H "Authorization: NHHxlCUMCrXfVQYZ" \
  -X POST \
  --data "{}" \
  "http://127.0.0.1:8080/api/channel"
```


## Login

```bash
curl -X POST \
  --data "{\"username\":\"foo\",\"password\":\"bar\"}" \
  "http://127.0.0.1:8080/api/login"
```
