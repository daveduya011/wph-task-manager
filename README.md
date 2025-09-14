# Task Manager

A full-stack task management application built with Next.js, allowing users to efficiently organize, prioritize, and track their tasks with a modern, responsive interface.

---

## Features Overview
- **User Authentication**: Sign-up and sign-in with email and password
- **Task Management**: View, Create, Edit, and Delete Tasks
- **View Modes**: Switch between Kanban board and table view
- **Drag & Drop**: Intuitive drag-and-drop functionality in Kanban view
- **Priority Levels**: High, Medium, and Low priority classification
- **Status Tracking**: To Do, In Progress, and Completed statuses
- **Due Dates**: Set and track task deadlines
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Persistent Storage**: Data stored securely in SQLite database
---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM
- **SQLite** - Database
- **Better Auth** - Authentication library

### Development Tools
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📋 Prerequisites

- Node.js (v20 or later)
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/daveduya011/wph-task-manager.git
   cd wph-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

---

## Usage

### Getting Started

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in with your credentials
3. **Create Tasks**: Click the "Create" button to add new tasks
4. **Manage Tasks**: Use the Kanban board or table view to organize your work

### Task Operations

- **Create**: Add new tasks with title, description, priority, status, and due date
- **Read**: View task details in the task details page
- **Update**: Edit tasks by clicking the edit button or directly in the interface
- **Delete**: Remove tasks with the delete button

### View Modes

- **Kanban View**: Visual board with drag-and-drop functionality
- **Table View**: Traditional table layout with all task information

---

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/
│   │   │   │   └── route.ts          # Authentication API routes
│   │   │   └── tasks/
│   │   │       ├── route.ts          # Tasks API routes
│   │   │       └── [id]/
│   │   │           └── route.ts      # Individual task API routes
│   │   ├── globals.css               # Global styles and Tailwind config
│   │   ├── layout.tsx                # Root layout component
│   │   ├── page.tsx                  # Home page (task dashboard)
│   │   ├── signin/
│   │   │   └── page.tsx              # Sign-in page
│   │   ├── signup/
│   │   │   └── page.tsx              # Sign-up page
│   │   └── task/
│   │       ├── [id]/
│   │       │   └── page.tsx          # Task details page
│   │       ├── CreateOrUpdateTask.tsx # Task creation/editing component
│   │       └── page.tsx              # Task creation page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── KanbanView.tsx        # Kanban board component
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   └── TableView.tsx         # Table view component
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx          # Individual task card
│   │   │   ├── TaskForm.tsx          # Task creation/editing form
│   │   │   └── TaskList.tsx          # Task list container
│   │   └── ui/                       # Reusable UI components
│   ├── lib/
│   │   ├── actions.ts                # Server actions
│   │   ├── auth.ts                   # Authentication configuration
│   │   ├── auth-client.ts            # Client-side auth utilities
│   │   ├── fetch-api.ts              # Fetch wrapper with auth (cookies)
│   │   ├── routes.ts                 # Route definitions
│   │   └── utils.ts                  # Utility functions
│   ├── middleware.ts                 # Authentication middleware
│   └── types/
│       └── task.ts                   # TypeScript type definitions
├── prisma/
│   └── schema.prisma                 # Database schema
├── public/                           # Static assets
└── specs/                           # Project specifications and documentation
```

---

## API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Sign up user
- `POST /api/auth/signout` - Sign out user

### Task Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Task Data Structure

```typescript
interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'To Do' | 'In Progress' | 'Completed'
}
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```
---

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format:fix   # Format code with Prettier
```

---

## 🙏 Acknowledgments
- WPH
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication powered by [Better Auth](https://better-auth.com/)
- Database managed by [Prisma](https://prisma.io/)
- Icons from [Lucide](https://lucide.dev/)
