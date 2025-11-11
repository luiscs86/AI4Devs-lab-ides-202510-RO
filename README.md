# EN
# LTI - Talent Tracking System

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is initiated with Create React App, and the backend is written in TypeScript.

## Directory and File Explanation

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`:  The entry point for the backend server.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
  - `.env`: Contains the environment variables.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files such as the HTML file and images.
  - `build/`: Contains the production-ready build of the frontend.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend

The frontend is a React application, and its main files are located in the `src` directory. The `public` directory contains static assets, and the build directory contains the production `build` of the application.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- The `src` directory contains the source code
- The `prisma` directory contains the Prisma schema.

## First steps

To get started with this project, follow these steps:

1. Clone the repo
2. install the dependencias for frontend and backend
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Build the backend server
```
cd backend
npm run build
````
4. Run the backend server
```
cd backend
npm run dev 
```

5. In a new terminal window, build the frontend server:
```
cd frontend
npm run build
```
6. Start the frontend server
```
cd frontend
npm start
```

The backend server will be running at http://localhost:3010, and the frontend will be available at http://localhost:3000.

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

Install Docker on your machine if you haven't done so already. You can download it here.
Navigate to the root directory of the project in your terminal.
Run the following command to start the Docker container:
```
docker-compose up -d
```
This will start a PostgreSQL database in a Docker container. The -d flag runs the container in detached mode, meaning it runs in the background.

To access the PostgreSQL database, you can use any PostgreSQL client with the following connection details:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Please replace User, Password, and Database with the actual user, password, and database name specified in your .env file.

To stop the Docker container, run the following command:
```
docker-compose down
```
