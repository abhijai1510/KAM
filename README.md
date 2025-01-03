# Restaurant KAM Lead Management System 🍽️

A modern web application for managing restaurant leads and Key Account Manager (KAM) interactions. Perfect for sales teams and account managers working with restaurants.

## 🌟 Features

- **Dashboard Overview**
  - Quick stats on total restaurants, active leads, and follow-ups
  - Recent interaction timeline
  - Performance metrics at a glance

- **Restaurant Management**
  - Add and edit restaurant details
  - Track restaurant status (New, Active, Inactive)
  - Manage multiple contact persons per restaurant
  - Assign KAMs to restaurants

- **Interaction Tracking**
  - Log calls, visits, and orders
  - Set follow-up reminders
  - View interaction history by restaurant
  - Track KAM activities

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-kam-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database
   - Run the schema file:
     ```bash
     mysql -u your_username -p your_database < database/schema.sql
     ```

4. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add the following configurations:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=kam_lead_management
     PORT=3000
     ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and visit: `http://localhost:3000`

## 📚 API Documentation

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Add a new restaurant
- `PUT /api/restaurants/:id` - Update restaurant details
- `GET /api/restaurants/:id/contacts` - Get restaurant contacts

### Contacts

- `POST /api/contacts` - Add a new contact
- `GET /api/contacts` - Get all contacts

### Interactions

- `GET /api/interactions` - Get all interactions
- `POST /api/interactions` - Add a new interaction

### KAMs (Key Account Managers)

- `GET /api/kams` - Get all KAMs
- `POST /api/kams` - Add a new KAM

## 📊 Database Schema

```
┌──────────────┐     ┌──────────────┐
│     KAMs     │     │  Restaurants │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ name         │     │ name         │
│ email        │     │ address      │
│ created_at   │     │ contact_num  │
└──────────┬───┘     │ status       │
           │         │ kam_id       │◄─┐
           └────────►│ created_at   │  │
                     └──────────────┘  │
                           ▲           │
                           │           │
                    ┌──────┴────────┐  │
                    │   Contacts    │  │
                    ├───────────────┤  │
                    │ id            │  │
                    │ restaurant_id │  │
                    │ name          │  │
                    │ role          │  │
                    │ phone_number  │  │
                    │ email         │  │
                    └───────────────┘  │
                                      │
                    ┌────────────────┐│
                    │  Interactions  ││
                    ├────────────────┤│
                    │ id             ││
                    │ restaurant_id  ││
                    │ kam_id         ├┘
                    │ date           │
                    │ type           │
                    │ notes          │
                    │ follow_up      │
                    └────────────────┘
```

## 🤝 Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Support

For support, email support@example.com or join our Slack channel.
