# BillSplit

## Start App

### Start Local Database

```sh
cd backend
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
npx prisma generate
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
