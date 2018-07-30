# Angular Application - Group Chat Application 

Angular is a platform that makes it easy to build applications with the web. Angular combines declarative templates, dependency injection, end to end tooling, and integrated best practices to solve development challenges. Angular empowers developers to build applications that live on the web, mobile, or the desktop

A frontend application in which multiple users can chat inside a group.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Note : You can skip this steps if you have Node ,npm and angularCLI installed on your system.
 
1) To start with this, install node and npm

* [NodeJs](https://nodejs.org/en/) - How to install node?

2) Install git 


* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - How to install Git?

3) Use npm to install Angular CLI . Exceute this command

```
>npm install -g @angular/cli
```

 
### Installing/ Running locally


1) Create a folder named as chat-app at any local drive

2) change directory to chat-app

```
>cd chat-app
```

3) Fetch the source code from my github library
 
```
>git init
```

```
>git remote add origin https://github.com/ShahrukhSayyed/full-stack-chat-application-Front-.git
```

```
>git pull origin master
```

4) Install all the modules required to run the given application with following command

```
>npm install
```

5) Run the application by using following command

```
>ng serve --open
```

6) Navigate to http://localhost:4200/ via browser . You will see the application is running.


* [Demo](http://chatapp.shahrukhsayyed.tech) - Application is up and running here

## More about the application

Application is having following views -

1) User management
​
 - Login, signup and forgot password functionality. Used nodemailer npm module for sending out emails such as welcome email, password
reset email etc.

2) Chat rooms management
​
 - User is be able to create a chat room and share the link via email. User is also be able to delete a chat room, mark it as
closed(inactive) and perform basic edits such as changing the title of the chat room.

3) Join chat rooms - 
​
There will be two ways to join a chat room -

a)
Via invite link - If a particular user clicks the invite link sent by another
email, he will be allowed to join the chat room

b)
Via list of active chat rooms - User will be displayed a list of active chat rooms (the ones that have not been closed). When user clicks a chat
room, he will see an option to join the room. Once he clicks on that join button, he will be added to that chat room. 

All the users in chat room will be informed when a new user joins/leaves the room.

4) Message in the chat room 

- User will be able to chat with other users of chat room in realtime. There will be an option displaying who is currently typing a
message and user will be able to view all the previous chat in that room.

5) Documentation 

- All the APIs and Events are well documented using npm module apiDoc 

* [APIDOC](http://chatapp.apidoc.shahrukhsayyed.tech) - APIDOC of chat-application backend
* [NPM](http://chatapp.eventdoc.shahrukhsayyed.tech) - EventDoc of chat-application backend

## Built With

* [Angular](https://angular.io/) - The web framework used for Frontend Design
* [NPM](https://www.npmjs.com/) - Most of the modules are used
* [nodemailer](https://nodemailer.com/about/) - NPM module to send the mails
* [apiDoc](http://apidocjs.com/) - NPM module to create the apiDoc and eventDoc


## Authors

* **Shahrukh Sayyed** - *Initial work* - [PurpleBooth](https://github.com/ShahrukhSayyed)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for detailsg

## Acknowledgments

* Thanks for Edwisor to review this application.
* I would like to thank my friends for supporting me to develop this Application.

