# Project Management App

A task management application designed to help users create, assign, and track tasks, with a visual Kanban dashboard to manage task statuses efficiently. Admin users can manage user accounts, while regular users can focus on task completion and progress tracking.

## Description

This is a task management app where users can:
- Add and assign tasks.
- Set deadlines for tasks.
- Track tasks on a Kanban dashboard with drag-and-drop functionality for status updates.
- Admin users have the ability to create, update, deactivate, and manage users.
- Regular users can log in, view tasks assigned to them, and update task statuses.

## Tech Stack

- **Frontend**: Shadcn, TailwindCSS
- **Backend**: T3 Stack (with Prisma)
- **Database**: Supabase
- **Serverless Functions**: AWS Lambda
- **Deployment**: SST (Serverless Stack)

## Features

- **Task Management**: 
  - Create, update, and assign tasks to users.
  - Set and update deadlines for tasks.
- **User Management** (Admin):
  - Add new users, deactivate users, and edit user details.
- **Kanban Dashboard**:
  - Track tasks visually with a Kanban-style board.
  - Drag and drop tasks to change status.
- **User Profile**:
  - Update user profiles and details.
- **Task Tracking**:
  - View task statuses and update them in real-time.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/vaibhav17sharma/ProjectManagementApp.git
    ```

2. Install dependencies:

    ```bash
    cd project-management-app
    npm install
    ```

3. Set up your environment variables (e.g., Supabase credentials, AWS Lambda settings) in a `.env` file.

4. Run the application locally:

    ```bash
    npm run dev
    ```

5. Visit `http://localhost:3000` in your browser to view the app.

## Usage

1. **Login as Admin**:
    - Use your admin credentials to log in.
    - Once logged in, you can create and manage users, assign tasks, and track progress.

2. **Login as a User**:
    - Regular users can log in with temporary passwords provided by the admin.
    - After logging in, users can view and manage their tasks.
    - Update task statuses by dragging and dropping tasks in the Kanban board.

3. **Task Updates**:
    - Each user can mark their tasks as "In Progress", "Completed", or other statuses directly from the Kanban dashboard.

## Contributing

We welcome contributions to improve the project! If you'd like to contribute, please fork the repository, create a branch, and submit a pull request with your proposed changes.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or need help with the app, feel free to reach out:

- Email: vaibhav17sharma.it@gmail.com
- GitHub: [https://github.com/vaibhav17sharma](https://github.com/vaibhav17sharma)

## Screenshots/Demo

![Kanban Dashboard](https://example.com/path/to/your/kanban-image.png)

---

Feel free to modify the content above based on your specific setup or additional features! Let me know if you'd like any changes or additional sections added.
