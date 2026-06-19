# EduChat

EduChat is a full-stack educational assistant built with Next.js on the frontend and NestJS on the backend. The project lets users ask questions, get AI-generated answers, and view basic project information on the About page.
<img width="720" height="359" alt="1" src="https://github.com/user-attachments/assets/e31bf827-67d7-4cc3-85e9-633411e3dc73" />
<img width="720" height="359" alt="2" src="https://github.com/user-attachments/assets/16d004c5-0b8d-4412-ba0b-cbf4a44c135c" />
<img width="719" height="360" alt="3" src="https://github.com/user-attachments/assets/f8112fa4-07dc-45a8-9844-a2c1358bb14f" />
<img width="720" height="359" alt="5" src="https://github.com/user-attachments/assets/54a88b86-64d5-425a-b782-0d6739706d9b" />
<img width="719" height="359" alt="4" src="https://github.com/user-attachments/assets/921075c3-d2a6-4e3e-9fab-3b040bcb6eda" />




## Project structure

- `frontend` — UI for the landing page, chat page, and about page
- `backend` — REST API and AI request logic
- `package.json` — root workspace configuration for running both apps

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- AI integration: Hugging Face Inference Providers via the OpenAI-compatible router API

## How the app works

1. The user enters a message in the chat UI.
2. The frontend sends the message to `POST /chat`.
3. The backend builds the AI request and returns the assistant reply.
4. The frontend displays the reply in the chat window.
5. `GET /about` provides information shown on the About page.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The backend requires:

- `HUGGINGFACE_API_TOKEN`
- `HUGGINGFACE_MODEL` (optional, defaults to a working provider model)
- `GOOGLE_CLIENT_ID` (for Google ID token verification)
- `GOOGLE_CLIENT_SECRET` (optional for advanced Google OAuth flows)
- `JWT_SECRET` (recommended for production)

The frontend can optionally use:

- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3000`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (required for the Google sign-in button)

### 3. Run the project

```bash
npm run dev
```

After that:

- backend runs at `http://localhost:3000`
- frontend runs at `http://localhost:3001`

## API endpoints

- `GET /` — backend health check
- `POST /chat` — sends a message and returns a reply object
- `GET /about` — returns metadata for the About page

## Notes

- The chat flow currently uses HTTP requests from the frontend to the backend.
- The backend is responsible for AI request execution and error handling.
- The project is ready for future improvements such as authentication, persistence, analytics, and better prompt management.

