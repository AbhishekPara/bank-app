# BankApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1.

A simple banking transactions web app:
- Create accounts (Chequing/Savings) with initial balance
- Transfer funds between accounts (validators: positive amount, cannot exceed balance, different accounts)
- View transaction history with search
- Reusable button component with conditional styling by account type
- Modular structure with Shared and Feature modules
- Angular Router for navigation

## Tech
- Angular (Reactive Forms: FormBuilder/FormControls)
- Bootstrap 5 (styling)

## Getting Started

To start a local development server, run:

```bash
npm i -g @angular/cli
ng new bank-app --routing --style=scss
cd bank-app
npm i bootstrap@5
# add "node_modules/bootstrap/dist/css/bootstrap.min.css" to angular.json styles
# copy repo files into src/
npm start

