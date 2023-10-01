<img src="./readme/title1.svg"/>

<br><br>

<!-- project philosophy -->
<img src="./readme/title2.svg"/>

A platform that collaborates project engineers process in a professional and easier way, engaging owner and manager with project process, real-time communication between engineers about issues and updates and their several other features.

Communication between engineer can increase the work functionality and troubleshooting 
With my project features engineers can create their own virtual world and collaborate. The platform empowers users with advanced version control, allowing them to identify conflicts between their files and the primary versions. They can review all changes and potential conflicts, deciding whether to accept or reject them. This ensures users always have control over their content. The ability to share issues and communicate about them is vital. However, the most important feature is managing their tasks using a Gantt Chart that provides the best management practices

I'm looking to incorporate AI more extensively by analyzing plan details and suggesting solutions to any problem based on historical data. Additionally, I aim to assist engineers by structuring and designing buildings, focusing on the concrete and steel aspects, as well as in an architectural manner.

### User Stories

- As a user, I want to upload my files so that I can share them with team members.
- As a user, I want to receive updated and modified files so that I can stay informed.
- As a user, I want to create a new branch so that I can post my files separately.
- As a user, I want check plan details so that I can have knowladge.
- As a user, I want to create a new branch so that I can post unapproved update files without modifying the original.
- As a user, I want to create a new copy of the main file so that I can make changes in it.
- As a user, I want to check if there are any conflicts between my files and the main one so that I can stay organized.
- As a user, I want to see all changes and conflict so that i can accepted or not.
- As a user, I want to accept or reject files before uploading them so that I can maintain control.
- As a user, I want to request permission to upload a new version to the main branch so that I can share my work.
- As a user, I want to view my old updates so that I can reuse them.
- As a user, I want to create a chat room with other members so that I can communicate and share opinions.
- As a user, I want to organize my daily tasks in a sequential manner so that I can work efficiently.
- As a user, I want to review my daily tasks so that I can stay organized.
- As a user, I want to schedule my tasks by priority so that I can manage my workload effectively.
- As a user, I want to share my issues so that I can resolve them faster.
- As a user, I want to tag specific members related to my issue so that I can communicate directly.
- As a user, I want to reset my password so that I lose my files.
- As a manager, I want to see all project titles so that I can stay organized.
- As a manager, I want to add users to projects so that I can maintain control.
- As a manager, I want to approve files from members so that I can ensure quality and organization.
- As a manager, I want to create new teams so that I can enhance work quality.
- As a manager, I want to add and remove members so that I can control the budget and work capacity.
- As a manager, I want to change project statuses so that I can manage my projects effectively.

<br><br>
<!-- Prototyping -->
<img src="./readme/title3.svg"/>

### Mockups
| Login screen  | Dashboard Section | Issues Section |
| ---| ---| ---|
| ![Landing](./readme/loginpage.jpg) | ![fsdaf](./readme/Dashborad.jpg) | ![fsdaf](./readme/IssuesSection.jpg) |

| Tasks Section  | Loading Screen |  Files Section |
| ---| ---| ---|
| ![Landing](./readme/TasksSection.jpg) | ![fsdaf](./readme/ezgif.com-resize.gif) | ![fsdaf](./readme/FilesSection.jpg) |


<br><br>

<!-- Implementation -->
<img src="./readme/title4.svg"/>

> Using the wireframes and mockups as a guide, we implemented the ProjectHub app with the following features:


### Admin Screens (Desktop)
| Dshbored Section  | Project Section |  Team Members screen |
| ---| ---| ---|
| ![Landing](./readme/Dashboard_manager.jpg) | ![fsdaf](./readme/ProjectSection.jpg) | ![fsdaf](./readme/TeamMembers.jpg) |

![fsdaf](./readme/gif.gif)
<br><br>

<!-- Tech stack -->
<img src="./readme/title5.svg"/>

###  ProjectHub is built using the following technologies:

- This project uses the [Electron framework](https://www.electronjs.org/). Electron embeds Chromium and [Node.js](https://nodejs.org/en) to enable web developers to create desktop applications.
- For persistent storage (database), the app uses [MySQL](https://www.mysql.com/) package which allows the app to create a custom storage schema and save it to a local database.
- On paralllel with Electron I Used [Python](https://www.python.org/) where is a programming language that lets you work more quickly and integrate your systems more effectively.
- As a Frontend [React](https://react.dev/) that declarative, efficient, and flexible JavaScript library for building user interfaces or UI components.
- For handling database records I used [Laraverl](https://laravel.com/) that include Eloquent where is an object relational mapper (ORM).
- [Firbase](https://firebase.google.com/?gad=1&gclid=CjwKCAjwseSoBhBXEiwA9iZtxsTCyMaNaWShkDwkOZYQTfNahGinS-OquPbbTv-_aUAEuz1BWX6ACBoCNA0QAvD_BwE&gclsrc=aw.ds) To handle the Create rooms and real-time messaging between Teams member.
- [OpenAI](https://openai.com/) to read the plan details and content, and provide the area and dimensions of each object.
  

<br><br>

<!-- How to run -->
<img src="./readme/title6.svg"/>

> To set up ProjectHub locally, follow these steps:

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/MhdTarhini/ProjectHub.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter eletron file
   ```js
   cd electron
   ```
4. Run React
   ```js
   npm run react:start
   ```
5. Run Electron
   ```js
   npm run eletron:start
   ```

### Postman Collection
[ProjectHub API's](./readme/ProjectHub-API's.postman_collection.json)
### Demo Accounts

- email: loren@gmail.com, password: 1234567, and role: Manager of 2 projects (Hospital, Building) only Hospital project is Active.
- email: leonardo@gmail.com, password: 1234567, and role: member in Architect Team in hospital project.
- email: tala@gmail.com, password: 1234567, and role:  member in Site Team at hospital project.
- email: tony@gmail.com, password:1234567, and role: member in Office Team at building project (pending project)

Now, you should be able to run ProjectHub locally and explore its features.
