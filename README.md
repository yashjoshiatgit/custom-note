# Custom Note-Taking Application

A full-stack, AI-powered Note-Taking application built with React, Spring Boot, and PostgreSQL, styled similarly to Microsoft OneNote.

## Features

- **Interactive Canvas Editor**: Visual mind-map style note-taking with draggable text nodes and connectors.
- **AI Integration**: Powered by Gemini 2.5 Flash to automatically convert raw text blocks into structured canvas layouts.
- **Robust Versioning**: A time-travel playback system to view visual note history.
- **Strong Security**: Built-in JWT authentication combined with a role-based admin dashboard.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Zustand, Konva.js (React-Konva)
- **Backend**: Spring Boot 3, Spring Security, Spring Data JPA, WebClient
- **Database**: PostgreSQL (Migrations managed by Flyway)

## Startup Guide

To start the application locally, you will need three separate processes running.

### 1. Database Start
Initialize the PostgreSQL container using Docker Desktop:
```bash
docker-compose up -d
```

### 2. Frontend Start
Open a terminal in the `frontend` directory:
```bash
cd frontend
npm run dev
```

### 3. Backend Start (IntelliJ IDEA)
Open the `backend` folder as an existing project in IntelliJ IDEA.

**Important JVM Option**:
When creating your Run Configuration in IntelliJ, be sure to set the Timezone VM option so the JDBC driver doesn't crash on connection.

Add this exact string to the **VM options** box:
```text
-Duser.timezone=Asia/Kolkata
```
Then hit Run!

*(Alternative: You can also specify this in your local environment variables.)*
