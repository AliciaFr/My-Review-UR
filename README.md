# My Review UR - A Peer Code Review  Platform for students of the University of Regensburg


### The Idea
In the context of a bachelor thesis, a code review platform for students of the chair of media informatics at the University of Regensburg was designed to assist students, in creating peer code reviews for their fellow students. The aim was to design and develop a web application as a prototype which integrates into the workflow of handling programming exercises with GitHub. Therefore, the platform is retrieving the code from the GitHub repositories of the students via the GitHub API.

### Features of the platform

#### Releasing a project by the students themselves
The students can decide by themselves wether they want a project to be reviewed or not.
The only restriction is not allowing users to release their projects before the offical deadline of the project has elapsed. This is done in order to prevent plagiarism among the students.

#### Automatically assigning the project to a reviewer
Once a project is released, the programm checks for other users, who had to do the same project and It then assigns the project for reviewing to the most recent user submitting their project.

#### Writing comments directly in the code with a code editor
To write a comment, the user has to comment the code. This is done by loading the file contents in code editor.

#### Assistance for the code review process
To assist the students during writing their code reviews help is provided. 
With a checklist students can check for certain aspects of the code that need attention like code formating or using coding best practices.

#### Rating received reviews
After students received their reviews, they can rate it.
The students have answer if the review was useful to them and write a comment for the reviewer.

#### Anonymous Avatars
To reduce the inhibition threshold for reviewing and releasing projects, all users get a randomly generated username and profile picture.

### The Views
#### Dashboard
Overview of their own and assigned projects

![Dashboard](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Dashboard.PNG?raw=true)

#### Releasing projects
Students have to fill in a form where they can specify testing errors of their programms and extra features of their project.

![Release form](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Projektfreigabe.PNG?raw=true)

#### Creating A Review
An overview gives the user important information about the project.

![Project Overview](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Review-erstellen-Uebersicht.PNG?raw=true)

When users want to review a project, a modal providing a guideline for reviewing projects shows up.

![Guideline](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Review-erstellen-Hinweis.PNG?raw=true)

A checklist helps the user to find criteria to rate the code.

![Checklist](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Checkliste.PNG?raw=true)

#### View Reviews
Review comments are higlighted in the code editor and the file path of changed files is highlighted in the project structure.
![View Reviews](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Prototyp-Review-Ansicht.PNG?raw=true)

#### Rating a review
To rate a received review users have to fill in a short form.

![Rate A Review](https://github.com/AliciaFr/My-Review-UR/blob/master/src/assets/Usability-Problem-Review-Button.PNG?raw=true)


### How To Use

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve
```

### License
[MIT](https://opensource.org/licenses/MIT)
