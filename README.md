# BillSplit

## Project Overview

BillSplit is an innovative financial management application that facilitates efficient tracking and settling of shared expenses among group members. It is designed for anyone from roommates splitting rent to friends sharing expenses on a trip. The app incorporates a detailed expense recording system, group financial management, and personal accounting features to ensure everyone pays their fair share without the hassle.

### Key Features

1. **Group Creation** - Set up groups tailored to specific events or social gatherings and add participants accordingly.
2. **Expense Logging** - Users can log expenses within a group by specifying details such as date, category, item, amount, payer, and how costs are split among participants.
3. **Expense Editing** - Modify recorded expenses to correct or update information as necessary.
4. **Balance Settlement** - Calculate total expenditures and determine how much each member owes or is owed, simplifying the process of settling debts.
5. **Repayment Tracking** - Keep track of individual repayments, ensuring that all debts are settled according to previous agreements.
6. **Personal Ledger** - Allow users to integrate and review all shared expenses across different groups in one place. This feature is ideal for users who need a holistic view of their financial contributions and liabilities, making personal budgeting and financial planning much easier.

### Tech Stack

- Frontend: React, Next.js, Chakra UI
- Backend: Node.js, Express
- Database: MongoDB

## Getting Started

### Start Local Database

```sh
docker-compose up -d
```

### Backend

1. Prepare `.env` under `frontend`

```txt
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

DATABASE_URL=mongodb://root:prisma@localhost:27017/BillSplit?authSource=admin

JWT_SECRET=abc
```

2. Step

```sh
cd backend
npm install
npx prisma format
npx prisma generate
node ./scripts/createCategory.js
node ./scripts/createCurrency.js
npm run dev
```

### Frontend

1. Prepare `.env` under `frontend`

```txt
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

2. Step

```sh
cd frontend
npm install
npm run dev
```
