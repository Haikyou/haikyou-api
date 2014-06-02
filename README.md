Haikyou API (Beta)
====================

Haikyou JSON REST API.


Making a request
----------------

All URLs in the Haikyou API starts with `http://haikyou.herokuapp.com/`.

```shell
curl -i -X GET http://haikyou.herokuapp.com/something
```


JSON
-----------------

Haikyou only support JSON for serialization of data.


Handling errors
---------------

If Haikyou is having trouble, you might see a 5xx error. `500` means that Haikyou is down, `503 Service Unavailable`, or `504 Gateway Timeout`.

400 means the request is bad. 422 means "Not an haiku"

API
========

Get all my posts
-----------

* `GET /conversation` will return this.

```json
[
	{
	  "from": "Bebop",
	  "to": "Rocksteady",
	  "visibility": "public"
	  "message": "Sup dog? This is not an haiku poem",
	  "date": "2014-01-22T10:56:50+01:00",
	},
	{
	  "from": "Rocksteady",
	  "to": "Bebop",
	  "visibility": "private"
	  "message": "Sup dog? This is yet not an haiku poem",
	  "date": "2014-01-22T10:56:51+01:00",
	},	
]
```

Send a message
-----------

* `PUT /conversation` will send a message

```json
{
  "from": "Bebop",
  "to": "Rocksteady",
  "visibility": "public"
  "message": "Sup dog? This is not an haiku poem",
}
```

