# API Endpoints

## Authentication

*   `POST /api/auth/signup` - Register a new user
*   `POST /api/auth/login` - Login a user
*   `GET /api/auth/me` - Get the currently logged in user

## Hackathons

*   `POST /api/hackathons` - Create a new hackathon
*   `GET /api/hackathons` - Get all hackathons
*   `GET /api/hackathons/:id` - Get a single hackathon
*   `PUT /api/hackathons/:id` - Update a hackathon
*   `DELETE /api/hackathons/:id` - Delete a hackathon

## Registrations

*   `POST /api/registrations` - Register for a hackathon
*   `GET /api/registrations` - Get all registrations
*   `GET /api/registrations/:id` - Get a single registration
*   `DELETE /api/registrations/:id` - Delete a registration
