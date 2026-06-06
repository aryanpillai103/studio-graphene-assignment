# 📝 Personal Task Manager

A full-stack task management application (glorified to-do list) built for the "Personal Task Manager" exercise. This single-user application allows creating, viewing, updating, and deleting personal tasks with features like filtering, searching, dark mode, and persistent storage using JSON file storage.

---

## 🌐 Live Demo

**Deployed Application:** [https://studio-graphene-assignment-wine.vercel.app](https://studio-graphene-assignment-wine.vercel.app)

**API Base URL:** `https://task-manager-api-hvco.onrender.com/api`

> **Note:** The backend is hosted on Render's free tier and may take 30-60 seconds to spin up on first request. If the demo link doesn't work, the project might be undeployed to save resources. Follow the local setup instructions below to run it on your machine.

> **Note:** This project has been made with the help of Deepseek.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library with component-based architecture and hooks |
| **Vite** | 5.x | Fast build tool with Hot Module Replacement (HMR) |
| **Tailwind CSS** | 3.x | Utility-first CSS framework for rapid styling |
| **Axios** | 1.x | HTTP client with automatic JSON parsing |
| **date-fns** | 3.x | Lightweight date formatting and manipulation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime for server-side execution |
| **Express** | 5.x | Web framework for REST API routing |
| **UUID** | 9.x | Unique ID generation for task identifiers |
| **CORS** | 2.x | Cross-Origin Resource Sharing middleware |
| **fs (File System)** | Native | Node.js native module for JSON file read/write operations |

### Why These Choices?

**JSON File Storage over MongoDB/PostgreSQL/SQLite:**
- No database server or native driver installation required
- Zero configuration needed - works out of the box on any platform
- Perfect for single-user applications with moderate data
- Data persists in a human-readable `tasks.json` file
- Easy to backup, inspect, and debug
- No compilation issues on cloud platforms (unlike SQLite native drivers)
- Compatible with Render's free tier ephemeral storage

**Tailwind CSS over CSS Modules/Styled Components:**
- Faster development with utility classes
- Built-in dark mode support with `dark:` prefix
- Responsive design made simple with breakpoint prefixes
- No context switching between HTML and CSS files
- Smaller production bundle with purging

**Vite over Create React App:**
- Significantly faster development server startup
- Instant Hot Module Replacement
- Native ES module support
- Better build performance

**Express 5.x:**
- Latest version with improved async error handling
- Better security defaults
- Native Promise support
- Simplified middleware patterns

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v16 or higher
- **npm** v7 or higher (comes with Node.js)

Verify installation:
```
    node --version  # Should output v16.x.x or higher
    npm --version   # Should output 7.x.x or higher
```
Step 1: Clone the Repository:
```
    git clone <your-repository-url>
    cd personal-task-manager
```
Step 2: Install Backend Dependencies:
```    
    cd backend
    npm install
```

Step 3: Install Frontend Dependencies:
```
    cd ../frontend
    npm install
```
Step 4: Start the Backend Server:
```
    cd ../backend
    npm run dev
```
You should see:
   ``` 🚀 Server is running!
    📍 URL: http://localhost:3001
    📋 Health check: http://localhost:3001/api/health
    📝 Tasks API: http://localhost:3001/api/tasks
    💾 Storage: JSON File
    ✨ Ready to accept requests!
```
Step 5: Start the Frontend (Open a New Terminal):
    cd frontend
    npm run dev

You should see:
    VITE v5.x.x  ready in xxx ms
    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose

Step 6: Open the Application:
    Navigate to: http://localhost:5173
    That's it! The tasks.json file is automatically created in the backend/ folder on the first API request. No additional configuration needed.

Quick Test:
    ```fetch('/api/health')
      .then(res => res.json())
      .then(data => console.log('API Response:', data))
    ```

You should see the health check response, confirming the frontend and backend are connected.

📡 API Documentation

### Base URL:
    http://localhost:3001/api

Common Response Format:
All responses are in JSON format. Timestamps are in ISO 8601 format.

### Task Object Schema:
```
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "due_date": "2024-12-31",
        "completed": 0,
        "created_at": "2024-01-01T12:00:00.000Z",
        "updated_at": "2024-01-01T12:00:00.000Z"
    }
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique task identifier |
| `title` | string | Task title (required, non-empty) |
| `description` | string | Task description (optional, default: "") |
| `due_date` | string (date) | Due date in YYYY-MM-DD format (optional, default: null) |
| `completed` | number | 0 = active, 1 = completed (default: 0) |
| `created_at` | string (ISO 8601) | Creation timestamp |
| `updated_at` | string (ISO 8601) | Last update timestamp |
  
## 1. Health Check:
Check if the server is running.
```    
GET /api/health 
```

### Response (200 OK):
```
{
  "status": "ok",
  "message": "Server is running!",
  "timestamp": "2024-06-06T12:00:00.000Z",
  "storage": "JSON File",
  "endpoints": {
    "getTasks": "GET /api/tasks",
    "createTask": "POST /api/tasks",
    "updateTask": "PUT /api/tasks/:id",
    "deleteTask": "DELETE /api/tasks/:id",
    "toggleTask": "PATCH /api/tasks/:id/toggle"
  }
}
```
## 2. Get All Tasks:
Retrieve tasks with optional filtering and search.
GET /api/tasks

Query Parameters:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `status` | string | No | Filter tasks by completion status | `active` or `completed` |
| `search` | string | No | Search tasks by title (case-insensitive, partial match) | `groceries` |

```
Examples:
GET /api/tasks                          # All tasks
GET /api/tasks?status=active            # Only active tasks
GET /api/tasks?status=completed         # Only completed tasks
GET /api/tasks?search=groceries         # Tasks with "groceries" in title
GET /api/tasks?status=active&search=buy # Active tasks with "buy" in title

Response (200 OK):
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "due_date": "2024-12-31",
    "completed": 0,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Complete project",
    "description": "Finish the task manager app",
    "due_date": null,
    "completed": 1,
    "created_at": "2024-01-01T11:00:00.000Z",
    "updated_at": "2024-01-01T13:00:00.000Z"
  }
]
```
Notes:
Results are always ordered by created_at descending (newest first)
Empty search returns all tasks matching the status filter
No tasks found returns an empty array []

## 3. Create Task:
Create a new task. Title is required.
```POST /api/tasks```

```
Request Body:
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2024-12-31"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | Must not be empty or whitespace only |
| `description` | string | No | Defaults to empty string if not provided |
| `dueDate` | string | No | Should be YYYY-MM-DD format; defaults to null |

Response (201 Created):
```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_date": "2024-12-31",
  "completed": 0,
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

Error Response (400 Bad Request):
```
{
  "error": "Title is required"
}
```

Error Response (500 Internal Server Error):
```
{
  "error": "Failed to create task"
}
```

## 4. Update Task:
Update one or more fields of an existing task. Only provide the fields you want to change.
PUT /api/tasks/:id

URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The ID of the task to update |

Request Body (all fields optional):
```
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2024-12-25",
  "completed": true
}
```

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Update task title |
| `description` | string | Update task description |
| `dueDate` | string | Update due date (YYYY-MM-DD) |
| `completed` | boolean | `true` to mark complete, `false` to mark active |

### Response (200 OK):
```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "description": "Updated description",
  "due_date": "2024-12-25",
  "completed": 1,
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:30:00.000Z"
}
```
### Error Response (404 Not Found):
```
{
  "error": "Task not found"
}
```
5. Delete Task:
Permanently delete a task.
DELETE /api/tasks/:id

URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The ID of the task to delete |

### Response (200 OK):
```
{
  "message": "Task deleted successfully",
  "deletedTask": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "due_date": "2024-12-31",
    "completed": 0,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

Error Response (404 Not Found):
```
{
  "error": "Task not found"
}
```

## 6. Toggle Task Completion:
Quick toggle to mark a task as complete or active.
PATCH /api/tasks/:id/toggle

URL Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The ID of the task to toggle |

### Response (200 OK):

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "due_date": "2024-12-31",
  "completed": 1,
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:30:00.000Z"
}
```

### Notes:

1. If task was active (completed: 0), toggles to completed (completed: 1)

2. If task was completed (completed: 1), toggles to active (completed: 0)

3. Does not require a request body

### Testing the API:
Using curl (Mac/Linux/Git Bash):
# Health check
```
curl http://localhost:3001/api/health
```
# Create a task
```
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Testing the API"}'
```

# Get all tasks
```
curl http://localhost:3001/api/tasks


# Search tasks
curl "http://localhost:3001/api/tasks?search=test"

# Filter active tasks
curl "http://localhost:3001/api/tasks?status=active"
```

# Using PowerShell (Windows):

```
# Health check
Invoke-RestMethod http://localhost:3001/api/health

# Create a task
$body = @{ title = "Test task"; description = "Testing the API" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/tasks -Body $body -ContentType "application/json"

# Get all tasks
Invoke-RestMethod http://localhost:3001/api/tasks

# Run comprehensive test suite
cd backend
.\full-test.ps1
```

# 📁 Project Structure

```personal-task-manager/
│
├── backend/                              # Express API Server (Port 3001)
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.js                  # Task CRUD route handlers
│   │   │                                  #   - GET /api/tasks (list with filters)
│   │   │                                  #   - POST /api/tasks (create)
│   │   │                                  #   - PUT /api/tasks/:id (update)
│   │   │                                  #   - DELETE /api/tasks/:id (delete)
│   │   │                                  #   - PATCH /api/tasks/:id/toggle
│   │   ├── database.js                   # JSON file storage operations
│   │   │                                  #   - Creates tasks.json file
│   │   │                                  #   - Reads/writes task data
│   │   │                                  #   - Filters and searches tasks
│   │   │                                  #   - Handles CRUD operations
│   │   └── index.js                      # Express server entry point
│   │                                      #   - Middleware setup (CORS, JSON)
│   │                                      #   - Route mounting
│   │                                      #   - Error handling
│   ├── full-test.ps1                     # Comprehensive 16-test API test suite (PowerShell)
│   ├── package.json                      # Backend dependencies & scripts
│   │                                      #   Dependencies: express, cors, uuid
│   │                                      #   Dev: nodemon
│   └── .env.example                      # Environment variables template
│
├── frontend/                             # React Application (Port 5173)
│   ├── src/
│   │   ├── components/                   # React Components
│   │   │   ├── TaskForm.jsx              # Task creation form
│   │   │   │                              #   - Expandable details (description, due date)
│   │   │   │                              #   - Character counter (500 max)
│   │   │   │                              #   - Days until due calculation
│   │   │   │                              #   - Shake animation on empty submit
│   │   │   ├── TaskItem.jsx              # Individual task card
│   │   │   │                              #   - Display mode with checkbox
│   │   │   │                              #   - Inline edit mode
│   │   │   │                              #   - Delete confirmation dialog
│   │   │   │                              #   - Overdue indicator
│   │   │   ├── TaskList.jsx              # Task list container
│   │   │   │                              #   - Empty state with suggestions
│   │   │   │                              #   - Maps through tasks array
│   │   │   ├── FilterBar.jsx             # Filter & search controls
│   │   │   │                              #   - All/Active/Completed buttons
│   │   │   │                              #   - Search input with clear button
│   │   │   ├── TaskStats.jsx             # Task statistics
│   │   │   │                              #   - Total/Active/Done counts
│   │   │   │                              #   - Progress bar
│   │   │   │                              #   - Celebration on all complete
│   │   │   └── DarkModeToggle.jsx        # Dark mode toggle button
│   │   │                                  #   - Sun/Moon icon
│   │   │                                  #   - Fixed position top-right
│   │   │                                  #   - Hover tooltip
│   │   ├── hooks/
│   │   │   └── useDarkMode.js            # Dark mode custom hook
│   │   │                                  #   - localStorage persistence
│   │   │                                  #   - System preference detection
│   │   │                                  #   - Toggle function
│   │   ├── App.jsx                       # Main application component
│   │   │                                  #   - State management
│   │   │                                  #   - API integration functions
│   │   │                                  #   - Keyboard shortcuts
│   │   │                                  #   - Layout structure
│   │   ├── main.jsx                      # React DOM entry point
│   │   └── index.css                     # Tailwind directives & custom styles
│   │                                      #   - @tailwind base/components/utilities
│   │                                      #   - Custom component classes (btn-primary, etc.)
│   │                                      #   - Dark mode styles
│   ├── public/                           # Static assets
│   ├── index.html                        # HTML template with favicon
│   ├── vite.config.js                    # Vite configuration
│   │                                      #   - React plugin
│   │                                      #   - API proxy to localhost:3001
│   ├── tailwind.config.js                # Tailwind theme customization
│   │                                      #   - Custom colors (primary palette)
│   │                                      #   - Custom animations (fade, slide, shake)
│   │                                      #   - Dark mode: 'class' strategy
│   ├── postcss.config.js                 # PostCSS for Tailwind processing
│   └── package.json                      # Frontend dependencies & scripts
│                                          #   Dependencies: react, react-dom, axios, date-fns
│                                          #   Dev: vite, @vitejs/plugin-react, tailwindcss
│
├── .gitignore                            # Git ignore rules
│                                          #   - node_modules/
│                                          #   - dist/
│                                          #   - .env
│                                          #   - *.json (database file)
└── README.md                             # Project documentation (this file)
```

## 🎯 Features Implemented

### Must Have ✅
- [x] Add task with title (required), description, and due date (optional)
- [x] View all tasks sorted by creation date (newest first)
- [x] Mark task as complete/incomplete with toggle
- [x] Edit task title, description, and due date inline
- [x] Delete task with confirmation prompt
- [x] Filter list by status: All, Active, Completed

### Should Have ✅
- [x] Active vs completed task count with statistics cards
- [x] Visual overdue task indicator (red border + warning text)
- [x] Empty state UI with helpful suggestions

### Nice to Have ✅
- [x] Search tasks by title (case-insensitive, partial match)
- [x] Persistent storage with JSON file (survives server restarts)
- [x] Dark mode toggle with system preference detection
- [x] Keyboard shortcuts for power users
- [x] Progress bar showing completion percentage
- [x] Celebration message when all tasks completed

### Bonus Features ✨
- [x] Responsive design (mobile, tablet, desktop)
- [x] Character counter on description field (500 max)
- [x] Days until due date calculation
- [x] Shake animation on empty title submission
- [x] Smooth animations and transitions
- [x] Hover effects and visual feedback
- [x] Browser tab favicon
- [x] Custom scrollbar styling

⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Focus new task input |
| `Ctrl + K` | Focus search input |
| `Ctrl + Shift + D` | Toggle dark/light mode |
| `Ctrl + Enter` | Save while editing task |
| `Esc` | Cancel editing task |
| `Enter` | Submit new task form |

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#5c7cfa` | Buttons, links, focus states |
| Primary Dark | `#4c6ef5` | Button hover, active states |
| Success | `#28a745` | Completed tasks, progress |
| Warning | `#ffc107` | Active tasks |
| Danger | `#dc3545` | Overdue tasks, delete actions |
| Dark BG | `#1e293b` | Dark mode background |
| Light BG | `#f0f2f5` | Light mode background |

### Typography
- **Font Family:** System font stack (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`)
- **Headings:** Bold, gradient text
- **Body:** Regular weight, good readability

### Animations
- **Fade In:** New tasks appear with translateY animation
- **Slide Down:** Error messages and expanded sections
- **Slide In:** Delete confirmation dialog
- **Shake:** Empty title validation feedback
- **Float:** Empty state icon subtle movement
- **Pulse:** Overdue task warning
- **Spin:** Loading spinner

## 🔜 Next Steps

### What Was Not Implemented (Scope Decisions)

| Feature | Reason for Exclusion |
|---------|---------------------|
| **User Authentication** | Exercise specified single-user, no auth needed. Adding JWT auth would be the next logical step for multi-user support. |
| **Drag-and-Drop Reordering** | Listed as "Nice to Have" bonus. Prioritized core CRUD functionality and UI polish over this feature. Would use `react-beautiful-dnd` or `@dnd-kit/core`. |
| **Unit/E2E Tests** | Testing was optional per requirements. Focused on manual testing and a comprehensive API test script. Would add Jest + React Testing Library. |
| **TypeScript** | Exercise allowed JavaScript or TypeScript. Used JavaScript for faster initial development. TypeScript would add type safety. |
| **MongoDB/PostgreSQL** | Requirements allowed JSON file/SQLite. Chose JSON file storage for zero-configuration, no native dependencies, and Render free tier compatibility. A production multi-user app would benefit from PostgreSQL. |
| **File Attachments** | Out of scope for a basic task manager. |
| **Recurring Tasks** | Out of scope but would be a valuable addition. |
| **Email/Push Notifications** | Requires additional infrastructure and services. |
| **Offline Support (PWA)** | Out of scope but would improve mobile experience. |

### What I Would Build Next

#### Phase 1 - Quality & Reliability (1-2 weeks)
- **Testing Suite:** Jest + React Testing Library for components, Supertest for API endpoints, Cypress for E2E tests
- **TypeScript Migration:** Add type safety to both frontend and backend
- **Input Validation Library:** Use Zod or Joi for request validation
- **Error Boundary:** React error boundary for graceful error handling
- **API Rate Limiting:** Protect backend from abuse with express-rate-limit
- **Logging:** Add Winston or Pino for structured logging

#### Phase 2 - Enhanced Features (2-3 weeks)
- **User Authentication:** JWT-based auth with login/register
- **Task Priority Levels:** High/Medium/Low with visual indicators
- **Task Categories/Tags:** Color-coded labels for organization
- **Due Date Reminders:** Browser notifications for upcoming/overdue tasks
- **Bulk Actions:** Delete all completed, mark all complete, export selected
- **Sort Options:** Sort by due date, priority, title, or creation date
- **Task Notes/Comments:** Rich text notes on tasks

#### Phase 3 - Advanced Features (3-4 weeks)
- **Drag-and-Drop Reordering:** Intuitive task reordering with persistence
- **Recurring Tasks:** Daily/Weekly/Monthly repeating tasks with rules
- **Multiple Task Lists:** Separate lists or projects (Work, Personal, Shopping)
- **Export/Import:** CSV export and JSON backup/restore
- **Activity Log:** Track all changes with timestamps
- **Keyboard Navigation:** Full accessibility with keyboard-only operation
- **Undo/Redo:** Action history for undo support

#### Phase 4 - Production Ready (2-3 weeks)
- **Docker Support:** Dockerfile and docker-compose for containerized deployment
- **CI/CD Pipeline:** GitHub Actions for automated testing and deployment
- **Environment Configuration:** Proper .env management for different environments
- **Database Migrations:** Use Knex.js for versioned database schema changes
- **Monitoring:** Application performance monitoring (APM) integration
- **Security Headers:** Helmet.js for security best practices
- **Compression:** Gzip/brotli compression for API responses
- **Caching:** Redis or in-memory caching for frequently accessed data

#### Phase 5 - Collaboration (4+ weeks)
- **Multi-User Support:** User accounts with personal task lists
- **Shared Lists:** Invite collaborators to task lists
- **Real-time Updates:** WebSocket integration for live changes
- **Comments & Mentions:** @mention collaborators in task comments
- **File Attachments:** Upload images/documents to tasks
- **Email Notifications:** Email reminders and collaboration notifications
- **Calendar Integration:** Sync tasks with Google Calendar/Outlook

#### Phase 6 - Platform Expansion 
- **PWA Support:** Install as mobile/desktop app with offline capability
- **Mobile Apps:** React Native for iOS/Android
- **API Versioning:** Support multiple API versions
- **Webhooks:** Event-driven integrations with other services
- **Analytics:** Task completion trends and productivity insights
- **Templates:** Pre-built task list templates
- **Dark Mode Improvements:** Multiple theme options
- **Accessibility Audit:** WCAG 2.1 AA compliance
- **Internationalization:** Multi-language support