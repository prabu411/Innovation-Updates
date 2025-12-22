# MongoDB Schema

## User

```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String",
  "role": "String" // 'student' or 'innovator'
}
```

## Hackathon

```json
{
  "_id": "ObjectId",
  "name": "String",
  "poster": "String", // URL to the poster image
  "organizer": "String",
  "dates": ["Date"],
  "mode": "String", // 'online', 'offline', or 'hybrid'
  "description": "String",
  "location": "String",
  "prizePool": "String",
  "themes": ["String"],
  "registrationLink": "String"
}
```

## Registration

```json
{
  "_id": "ObjectId",
  "hackathon": "ObjectId", // Reference to the Hackathon collection
  "user": "ObjectId", // Reference to the User collection
  "registrationDate": "Date"
}
```
