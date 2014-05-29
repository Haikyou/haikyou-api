Haikyou API
====================

Haikyou JSON REST API.


Making a request
----------------

All URLs in the Haikyou API starts with `http://api.haikyou.jord.io/v1/`.

```shell
curl http://api.haikyou.jord.io/v1/something.json
```


Authentication
--------------

At this point, there is no authentication to consider.

JSON
-----------------

Haikyou support JSON for serialization of data. **URLs in the API suffixed with .json to indicate that they accept and return JSON.**


Handling errors
---------------

If Haikyou is having trouble, you might see a 5xx error. `500` means that Haikyou is down, `503 Service Unavailable`, or `504 Gateway Timeout`.

400 means the request is terrible in general, 422 means you've sent a specific terrible request - probably because it was not an haiku



API
========

Get all my posts
-----------

* `GET /getall.json` will return this.

```json
{
  "from": "Bebop",
  "to": "Rocksteady",
  "visibility": "public"
  "message": "Sup dog? This is so not an haiku poem",
  "created_at": "2014-01-22T10:56:50+01:00",
}
```

Send a message
-----------

* `GET /send.json` will send a message

```json
{
}
```

