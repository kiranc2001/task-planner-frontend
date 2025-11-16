# task-planner-frontend

# AI Task Planner

## Overview

AI Task Planner is a full-stack productivity web app that integrates AI (OpenAI) for smart task scheduling suggestions. 
Users can manage tasks with CRUD operations, visualize them on a calendar, view completion analytics via charts, and receive email reminders for due tasks. 
The app features responsive design with dark/light theme toggle (no JWT—userId passed in paths).


**Application Screenshots** : https://github.com/kiranc2001/task-planner-backend/tree/main/screenshots


**Frontend Github Repo** : Current repo

**Backend Github Repo**: https://github.com/kiranc2001/task-planner-backend





**For more detailed explaination**:

Medium : https://medium.com/@kirangowda0212/building-an-ai-powered-task-planner-a-full-stack-journey-with-spring-boot-react-and-openai-e4a7acb4a8d4



## Key Features:

**Authentication**: Signup, signin, forgot password with OTP email, password reset.

**Task Management**: Add/edit/delete tasks with priority (LOW/MEDIUM/HIGH), status (PENDING/IN_PROGRESS/COMPLETED), description, due date.

**Dashboard**: List tasks with filters (priority, due date).

**AI Suggestions**: "Get Smart Schedule" button analyzes tasks and generates OpenAI-powered recommendations (e.g., prioritized order, estimated times).

**Calendar View**: Visualize tasks on interactive calendar (FullCalendar).

**Reports**: Pie chart for completed vs. pending tasks (Chart.js).

**Notification**: Daily cron job emails reminders for tasks due <24 hours.

**UI/UX**: Material-UI responsive design, dark/light theme toggle, linted code (ESLint + Prettier).

**Backend**: Spring Boot with MySQL, BCrypt hashing, OpenAI integration, custom error handling.


## Tech Stack:

**Backend**: Spring Boot 3.2.0, Java 21, JPA/Hibernate, PostgreSQL, OpenAI Java Client 4.7.1, Spring Mail for emails.

**Frontend**: React 18, TypeScript, Material-UI, Axios, React Router, FullCalendar, Chart.js.

**Tools**: IntelliJ for backend, VS Code for frontend, MySQL Workbench for DB, Postman for API testing.

**Linting**: ESLint + Prettier for frontend.


## Prerequisites:

Java 21 (JDK).

Node.js 18+ (NPM).

PostgreSQL (local server).

OpenAI API Key (for AI suggestions—free tier OK).

Gmail App Password (for emails/OTPs—enable 2FA on Gmail).

IntelliJ IDEA (backend), VS Code (frontend with ESLint/Prettier extensions).


## Backend Setup & Run

 1. **Clone/Setup Project**
- Create Spring Boot project in IntelliJ (or clone if repo'd).
- Update `pom.xml` (full from earlier; includes MySQL, OpenAI, Lombok, Validation, Mail, Scheduler).

2. **Database Setup**
- PgAdmin (PostgreSQL): Connect to localhost:5432 (user: root, pass: yourpassword).
- Run:
  ```sql
  CREATE DATABASE task_planner_db;
  ```
- Tables auto-create on startup (JPA `ddl-auto=update`).

3. **Configuration**
- `src/main/resources/application.properties`:
  ```properties
  server.port=9000
  spring.datasource.url=jdbc:postgresql://localhost:5432/task_planner_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  spring.datasource.username=root
  spring.datasource.password=yourpassword
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  spring.datasource.driver-class-name=org.postgresql.Driver
  openai.api.key=sk-your-openai-key-here
  spring.mail.host=smtp.gmail.com
  spring.mail.port=587
  spring.mail.username=your-gmail@gmail.com
  spring.mail.password=your-gmail-app-password
  spring.mail.properties.mail.smtp.auth=true
  spring.mail.properties.mail.smtp.starttls.enable=true
  logging.level.com.taskplanner=DEBUG
  ```
- Replace placeholders (OpenAI key from openai.com, Gmail app password).

4. **Run Backend**
- IntelliJ: Right-click `TaskPlannerBackendApplication.java` > Run.
- Logs: "Started TaskPlannerBackendApplication in X ms" (port 9000).
- Test: Postman signup (see below)—inserts user in DB.

5. **Backend API Endpoints (Test in Postman)**
Base: `http://localhost:9000/api`.


**User APIs**:

- POST `/users/signup` Body: `{ "name": "Kiran", "email": "test@test.com", "password": "pass123" }` → `{ "id": 1, "name": "Kiran", "email": "test@test.com" }` (200; 409 duplicate).
  
- POST `/users/signin` Body: `{ "email": "test@test.com", "password": "pass123" }` → `{ "id": 1, "name": "Kiran", "email": "test@test.com" }` (200; 401 invalid pass).
  
- POST `/users/forgot-password` Body: `{ "email": "test@test.com" }` → Empty (200; sends OTP email).
  
- POST `/users/test@test.com/reset-password` Body: `{ "otp": "123456", "newPassword": "newpass" }` → Empty (200; 400 invalid OTP).

**Task APIs (use userId=1)**:

- POST `/tasks/1` Body: `{ "title": "Test Task", "priority": "HIGH", "status": "PENDING", "dueDate": "2025-11-15T10:00:00" }` → Task object (200).
  
- GET `/tasks/1` → Task array (200).

- GET `/tasks/1/1` → Single task (200; 404 not found).

- PUT `/tasks/1/1` Body: `{ "status": "COMPLETED" }` → Updated task (200).

- DELETE `/tasks/1/1` → Empty (200; 404 not found).


**AI Suggestions**:

- POST `/ai/suggestions/1` Body: `{ "tasks": [ { "id": 1, "title": "Test Task", "priority": "HIGH", "dueDate": "2025-11-15T10:00:00" } ] }` → `{ "recommendations": "AI text..." }` (200; needs OpenAI key).

Analytics:

- GET `/analytics/tasks/1` → `{ "totalTasks": 1, "completedTasks": 0, "pendingTasks": 1, "completionPercentage": 0.0 }` (200).

Notifications: 

Internal (cron daily 9 AM)—test by editing `NotificationServiceImpl.java` to `@Scheduled(fixedRate = 30000)` (every 30s), restart, create due-soon task, wait/check email/DB.



## Frontend Setup & Run

1. **Clone/Setup Project**

- Create React app: `npx create-react-app task-planner-frontend --template typescript`.

- Install deps: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom fullcalendar @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction chart.js react-chartjs-2`.

- Lint deps: `npm install --save-dev eslint prettier @typescript-eslint/eslint-plugin@5.62.0 @typescript-eslint/parser@5.62.0 eslint-config-prettier eslint-plugin-prettier --legacy-peer-deps`.

2. **Configuration**

- `API_BASE` in `src/services/api.ts`: `'http://localhost:9000/api'`.

- `.eslintrc.json` and `.prettierrc` (from earlier).

- `tsconfig.json`: Standard CRA with `"strict": true`.

3. **Folder Structure**

src/
├── components/     # TaskCard.tsx
├── contexts/       # UserContext.tsx, ThemeContext.tsx
├── pages/          # Login.tsx, Dashboard.tsx, AddTask.tsx, AiSuggestions.tsx, Calendar.tsx, Reports.tsx
├── services/       # api.ts
├── types/          # index.ts
├── App.tsx
├── index.tsx
└── index.css


4. **Run Frontend**

- `npm start` (runs on 3000).

- Open `http://localhost:3000`.

- Login/Signup → Dashboard → Add task → AI/Calendar/Reports.

5. **Frontend Features**

Auth: Switch signup/signin; specific error messages (e.g., "Invalid password").

Dashboard: Task list with priority/date filters; add/edit/delete.

Add/Edit Task: Form with dropdowns for priority/status, datetime-local for due date.

AI Suggestions: Fetches tasks, sends to backend, displays OpenAI text.

Calendar: FullCalendar with task events (color by priority).

Reports: Pie chart (completed vs. pending) + percentage.

Theme: Toggle in nav (persists).

Logout: Clears storage, redirects to login.

 6. **Troubleshooting**
    
-Backend Not Connecting: Check port 9000 running; CORS in backend (`@CrossOrigin("*")`).

"Error occurred" on Login: Network tab > Response—backend message shown now.

"Missing userId": Clear localStorage; login again (sync save fixed).

-Lint Errors: `npm run lint --fix`.

-TS Errors: `npx tsc --noEmit`.

-Emails Not Sending: Check Gmail app password; backend logs for MailSender errors.

-AI Fails: Verify OpenAI key in backend properties; test in Postman.

-Notifications: Change cron to `fixedRate = 30000` for test; check `notifications` table.



## Deployment

- Backend: JAR via `mvn clean package` > `java -jar target/task-planner-backend-0.0.1-SNAPSHOT.jar` (Heroku/Railway; env vars for DB/OpenAI).

- Frontend: `npm run build` > Static host (Vercel/Netlify; set REACT_APP_API_BASE env).

- DB: Heroku ClearDB or Railway MySQL.

- Emails: Use SendGrid if Gmail limits.


## Contributing

- Fork repo.

- Backend: Add features in services/controllers; test with Postman.

- Frontend: Add pages/components; lint before PR.

- Issues: Report lint/DB/API bugs.


## Contact

**Email**: kirangowda0212@gmail.com

**LinkedIn**: https://github.com/kiranc2001/task-planner-backend


Run the App: Backend (IntelliJ) > Frontend (`npm start`) > Test flow. Enjoy your **AI Task Planner!** 🚀
