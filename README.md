# Faym Payout Assignment

Backend Assignment for Faym - A RESTful Affiliate Payout Management System built with Node.js, Express.js, MongoDB, and Mongoose.

---

# Features

- User Management
- Sales Management
- Advance Payout (10%)
- Final Payout (Remaining 90%)
- Withdrawal System
- Failed Payout Recovery
- Sale Approval / Rejection
- 24-hour Withdrawal Cooldown

---

# Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

# Project Structure

```
src
│
├── config
├── controllers
├── models
├── routes
└── services
```

Architecture follows:

MVC + Service Layer

---

# Database Models

## User

- name
- email
- withdrawableBalance
- lastWithdrawalAt

## Sale

- user
- brand
- product
- earning
- status
- advancePaid
- advanceAmount
- reconciled
- reconciledAt

## Payout

- user
- sale
- amount
- type
- status

---

# API Endpoints

## Users

### Create User

POST

```
/api/v1/users
```

---

## Sales

### Create Sale

POST

```
/api/v1/sales
```

### Get Sales

GET

```
/api/v1/sales
```

### Approve / Reject Sale

PATCH

```
/api/v1/sales/update-status
```

Body

```json
{
    "saleId":"...",
    "status":"approved"
}
```

When a sale is approved, the remaining payout (90%) is processed automatically.
---

## Payouts

### Advance Payout

POST

```
/api/v1/payout/advance
```

### Withdraw

POST

```
/api/v1/payout/withdraw
```

### Failed Payout Recovery

POST

```
/api/v1/payout/failed
```

---

# Business Flow

1. Create User
2. Create Sale
3. Give 10% Advance
4. Approve or Reject Sale
5. Approved → Remaining 90% credited
6. Rejected → Advance recovered
7. Withdraw available balance
8. Failed payout → Amount credited back

---

# Installation

Clone repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Run server

```bash
npm run dev
```

---

# Author

Devraj Songara

2025 B.Tech CSE Graduate
