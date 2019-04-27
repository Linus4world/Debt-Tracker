# Debt-Tracker

This mobile app helps you to keep track about loans/debts inside groups. Secure and easy. Available for Android, IOS and Windows Phone.

## Important notes

*NOTE* This project is not ready for deployment yet! It just features a basic structure which can be used to build a sound business model,
once connected to a public blockchain and a server for control data managemant.

## About

This app was developed in the context of the class **CS 189 A - SPECIAL TOPICS IN BUSINESS COMPUTING** of the Ateneo de Manila University Philippines in cooperation with [Nem](https://nem.io).
The project uses the Nem2-sdk for Typescript which can be found [here](https://github.com/nemtech/nem2-sdk-typescript-javascript).
The aim of the project was to build a basic structure of an app for a profitable business model that uses features of the nem blockchain.

## Requirements

- NodeJS
- Ionic 3
- Chrome / Firefox

## Installation

Download the newest version of NodeJS [here](https://nodejs.org/en/download/) and install. Make sure to set the PATH system variable so that you can use the ```npm``` command.
Next switch to a terminal or powershell.
Install Ionic3 and Cordova by typing:

```npm install -g cordova ionic```

Download the project files either manually or by running:

```git clone https://github.com/Linus4world/Debt-Tracker.git```

if you have Git installed.
Next go into the project folder and install all necessary dependencies by running:

```npm install```

You can now run the project using the command:

```ionic serve```

This will start a new local server at ```http://localhost:8100``` and open it automatically in your standart browser.

**Tip for Chrome:** To see the app in mobile view, go into inspect mode and click on **toggle device toolbar** at the upper taskbar.

## How to continue the development

To make transactions to other users you have to connect the app to a blockchain (either private or public). For this go into the project folder and open the file src > providers > nem > settings.ts.
Here you can set the url of the catapult api node and the network.
Furthermore, the app requires a mosaicID and the private key of a nem account that is in posession of these mosaics. 
Everytime a new user starts the app, an initial amount of tokens will be sent to the user to enable him to record debts.
To really make this app work there is also the need of a private server that will handle cross device communication such as
- Telling other users that they are now part of a new group
- Storing Account details in a cloud
- Search for friends by name to not use addresses
- etc.
For development it also might be usefull to use mock data. This is provided by the loader.ts class.

## Highlights of this version:

From now on, there is no need for a private server! You also do not need a super account or mosaics, since all transactions are transferred through messages. All control data is handled by a communication system trough the Blockchain. These messages handle: 
- Invitation of a new member into a group
- Acceptance of Invitation
- Info that a new member has joined the group
- Record of new debts
- Leave of a member

Furthermore, the details page now features a much more pleasant look, including charts and member chips.

*Note* Only the record of debt messages are sent right now. All other messages can be handled, but are not sent yet. To see the app working even without a Blockchain, members are added instantly without waiting for an acceptance.

## Troubleshooting
```npm install``` often leads to problems, depending on your machine. Make sure to have the newest versions of NodeJS, Ionic and Cordova. Sometimes you also have to install additional programs or dependencies. In case you are not able to run the project please contact me directly.
