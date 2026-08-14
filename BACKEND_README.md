# Ngogia - Apartment Management System Backend

A comprehensive backend API for managing apartment buildings, tenants, finances, and maintenance requests.

## Features

- **Room Management**: Create, read, update, delete apartment rooms with detailed information
- **Tenant Management**: Manage tenant profiles, lease agreements, and move-in/move-out dates
- **Financial Tracking**: Track income, expenses, and generate financial reports
- **Maintenance Requests**: Create and manage maintenance requests with priority levels
- **Dashboard Analytics**: Real-time KPIs and financial summaries
- **User Authentication**: JWT-based authentication with role-based access control
- **RESTful API**: Clean and intuitive API endpoints

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd appartment-management-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure `.env` with your settings:
```
MONGODB_URI=mongodb://localhost:27017/apartment-management
JWT_SECRET=your_secure_secret_key
PORT=5000
```

5. Start MongoDB:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or install MongoDB locally and start it
mongod
```

6. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/stats` - Get room statistics
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room (manager/admin)
- `PUT /api/rooms/:id` - Update room (manager/admin)
- `DELETE /api/rooms/:id` - Delete room (admin)

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get single tenant
- `POST /api/tenants` - Create tenant (manager/admin)
- `PUT /api/tenants/:id` - Update tenant (manager/admin)
- `DELETE /api/tenants/:id` - Delete tenant (admin)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/summary/financial` - Get financial summary
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction (manager/admin)
- `DELETE /api/transactions/:id` - Delete transaction (admin)

### Maintenance
- `GET /api/maintenance` - Get all maintenance requests
- `GET /api/maintenance/stats` - Get maintenance statistics
- `GET /api/maintenance/:id` - Get single maintenance request
- `POST /api/maintenance` - Create maintenance request
- `PUT /api/maintenance/:id` - Update maintenance request (manager/admin)
- `DELETE /api/maintenance/:id` - Delete maintenance request (admin)

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/revenue-history` - Get revenue history

## Authentication

To access protected endpoints, include JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Manager",
    "email": "alex@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@example.com",
    "password": "password123"
  }'
```

### Create Room
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "roomNumber": "101",
    "floor": "1st Floor",
    "type": "Studio",
    "area": 32,
    "monthlyRate": 1200,
    "amenities": "WiFi, AC"
  }'
```

## Database Schema

### Room
- roomNumber (String, unique)
- floor (String)
- type (Studio, 1BR, 2BR, 3BR, Penthouse)
- status (vacant, occupied, maintenance, reserved)
- area (Number)
- monthlyRate (Number)
- amenities (Array)
- tenant (ObjectId)
- notes (String)

### Tenant
- name (String)
- email (String)
- phone (String)
- room (ObjectId)
- moveInDate (Date)
- leaseEndDate (Date)
- monthlyRent (Number)
- deposit (Number)
- status (active, inactive, evicted)

### Transaction
- date (Date)
- type (income, expense)
- category (Rent, Deposit, Utility, Maintenance, Other)
- amount (Number)
- room (ObjectId)
- tenant (ObjectId)
- description (String)
- paymentMethod (cash, bank_transfer, check, credit_card, other)
- status (pending, completed, cancelled)

### Maintenance
- requestId (String, unique)
- room (ObjectId)
- issue (String)
- priority (Low, Medium, High, Critical)
- status (Open, In Progress, Scheduled, Completed)
- technician (String)
- estimatedCost (Number)
- actualCost (Number)
- notes (String)

## Error Handling

All errors return a consistent JSON format:

```json
{
  "error": "Error message",
  "stack": "... (development only)"
}
```

## Development

### Run tests
```bash
npm test
```

### Format code
```bash
npm run format
```

## Contributing

Please follow the existing code style and structure. Create a new branch for each feature.

## License

MIT License - feel free to use this project for your needs.
