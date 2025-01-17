# Products API

REST API for managing products with Contentful integration.

## Features

- Hourly sync with Contentful API
- Paginated product list
- Soft delete
- report endpoints
- Swagger

## Setup

1. Clone repository
2. Copy `.env.example` to `.env`
3. Configure environment variables
4. Run: docker-compose up -d

## Instructions

Import the cURLs to Postman

use the get Bearer token public endpoint to get a fresh one (1 hour expiration)

## Testing

you can use this command to check the coverage
npx jest --coverage

## API Docs

Swagger: http://localhost:3000/api/docs

### Public Endpoints

- GET /auth/token - Get a Bearer token
- GET /products - List products
- POST /products - Create product
- PATCH /products/:id - Update product
- DELETE /products/:id - Soft delete product

### Private Endpoints

- GET /reports/deleted-percentage - Get percentage of deleted products
- GET /reports/non-deleted-percentage - Get percentage of non-deleted products with filters
- GET /reports/products-statistics - Get some product statistics

## cURLs

### Public Endpoints - Products

Get bearer token

curl -X POST http://localhost:3000/auth/token \
-H "Content-Type: application/json" \
-d '{"username": "your-username", "role": "your-role"}'

List Products

curl -X GET "http://localhost:3000/products?page=1&limit=10" \
-H "Content-Type: application/json"

Sync Products from Contentful

curl -X GET "http://localhost:3000/products/sync" \
-H "Content-Type: application/json"

Delete Product

curl -X DELETE "http://localhost:3000/products/123" \
-H "Content-Type: application/json"

### Private Endpoints - Reports

Get Deleted Products Percentage

curl -X GET "http://localhost:3000/reports/deleted-percentage" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXItdXNlcm5hbWUiLCJyb2xlIjoieW91ci1yb2xlIiwiaWF0IjoxNzM3MTMxMjMzLCJleHAiOjE3MzcxMzQ4MzN9.c7NJ934T*aTDwDToSMOsiXyq8W*-UuHHw2snkI2XIEQ" \
-H "Content-Type: application/json"

Get Non-Deleted Products Percentage

curl -X GET "http://localhost:3000/reports/non-deleted-percentage?hasPrice=true&startDate=2024-01-01&endDate=2024-03-20" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXItdXNlcm5hbWUiLCJyb2xlIjoieW91ci1yb2xlIiwiaWF0IjoxNzM3MTMxMjMzLCJleHAiOjE3MzcxMzQ4MzN9.c7NJ934T*aTDwDToSMOsiXyq8W*-UuHHw2snkI2XIEQ" \
-H "Content-Type: application/json"

Get Products Statistics (the custom one)

curl -X GET "http://localhost:3000/reports/products-statistics" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXItdXNlcm5hbWUiLCJyb2xlIjoieW91ci1yb2xlIiwiaWF0IjoxNzM3MTMxMjMzLCJleHAiOjE3MzcxMzQ4MzN9.c7NJ934T*aTDwDToSMOsiXyq8W*-UuHHw2snkI2XIEQ" \
-H "Content-Type: application/json"
