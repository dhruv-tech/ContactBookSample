# ContactBookSample

## Routes

### POST /v1/contacts

Content-Type: application/json

*Example Body*
```
{
	"firstName": "Person",
	"lastName": "100",
	"email": "person100@human.life"
}	
```
(firstName, lastName & email are required)

=> Successful when status code is `210`.

### PUT /v1/contacts/:email

Content-Type: application/json

*Example Body*
```
{
	"lastName": "Hundred"
}	
```

*Example Route Params*

```
https://api.myapp.com//v1/contacts/person100@human.life

```
=> Successful when status code is `204`.

### GET /v1/contacts/:page/:query

Content-Type: application/json

*Example Route Params*

```
https://api.myapp.com//v1/contacts/1/person

```
(Returns first 10 contacts with name or email starting with 'person')

```
https://api.myapp.com//v1/contacts/1/

```
(Returns first 10 contacts)

=> Successful when status code is `200`.

### DELETE /v1/contacts/:email

Content-Type: application/json

*Example Route Params*

```
https://api.myapp.com//v1/contacts/person100@human.life

```
=> Successful when status code is `204`.
