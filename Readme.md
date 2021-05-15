# Git-Chat

**[Demo](https://suparth-git-chat.herokuapp.com/)
An Application for GitHub users to chat in real time**

---

### Tools Used:

`NodeJS` `Express` `SQLite` `Sequelize` `Socket.IO` `Pug` `HTML5/CSS3` `VanillaJS`

---

### About Tools:

- **Node JS:** Used for writing JavaScript in Server for the application

- **Express:** Used for implementing server side logic, routing and Middleware

- **SQLite3:** Database Used

- **Sequelize:** Used as ORM for SQLite3

- **Pug:** Used as templating engine

- **HTML/CSS:**C Website Structuring and Design

- **VanillaJS:** Used for Ajax Requests of the application

---

### About Application Structure

- The application is created in MVC fraomework on backend. The code for running the server is in `server.js` file which then links with the directory `routes` for routing, directory `controllers` for handeling logic being any HTTP route.
- The database migration and models are created by Sequelize-CLI, where the Schema for an entiry is written inside the
  directory: `models`. The nigration files are created automatically inside directory: `Migration`.
- The public files (CSS and JS files) are inside `public` directory
- The templates for pages are inside `views` directory
- The directory `utils` contains any utility files to run the application
- The directory `seeders` contains files that are used to seed data in the application

---

### Run Application Locally

**To run the application locally, following steps should be taken**

- **Clone the Repository using command:** `https://github.com/suparthghimire/git-chat.git`

- **Install NodeJS from This Link here:** [link](https://nodejs.org/en/)

- **Install all packages using command:** `npm install express sequelize sqlite3 socket.io pug`

- **Install optional dev dependencies:** `npm install -D nodemon sequelize-cli`

- **If Nodemon was installed, use command:** `npm run dev` else use `nom start`

- **Application will run on PORT:3000. Goto URL:** `https://localhost:3000` to view the application

---

Created By: [Suparth Narayan Ghimire](https://suparthanrayanghimire.com.np)
