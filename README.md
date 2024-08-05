
# CrypWallet

CrypWallet is a cryptocurrency wallet application that allows users to manage multiple wallets, view real-time cryptocurrency values, and perform transactions such as sending, receiving, buying, and exchanging cryptocurrencies. The application supports multiple languages and currencies for a personalized and global experience.

## Features

- **Multiple Wallet Management**: Create and manage multiple wallets for different cryptocurrencies.
- **Real-Time Visualization**: View real-time cryptocurrency values.
- **Transactions**: Easily send, receive, buy, and exchange cryptocurrencies.
- **Multi-Language Support**: The application can be used in various languages.
- **Multiple Currency Support**: Check and perform transactions in different currencies (USD, EUR, COP, etc.).

### Entity-Relationship Diagram

Below is an entity-relationship diagram illustrating the database structure for the application.

![Entity-Relationship Diagram](https://res.cloudinary.com/dafsjo7al/image/upload/v1722881847/CrypWallet_vkuwyz.png)

You can view the diagram in high resolution and with more details at the following link:

[View Entity-Relationship Diagram](https://dbdiagram.io/d/CrypWallet-6653be68f84ecd1d222fcb9e)

## Installation

Follow the steps below to install and run CrypWallet:

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- 🐳 Docker and Docker Compose installed on your machine.
- Node.js and npm (optional for development and local testing).

### 1. Clone the Repository

```bash
git clone https://github.com/SebastianHinestroza12/CrypWallet-api.git

cd CrypWallet-api

```
### 2. Configure Environment Variables

Create a `.env` file in the root of the project and configure the following environment variables:

```json
{
  "PORT": "3001",
  "DB_USER": "postgres",
  "DB_PORT": "5432",
  "DB_HOST": "postgres_db",
  "DB_NAME": "YOUR_DB_NAME",
  "DB_PASSWORD": "YOUR_DB_PASSWORD",
  "JWT_SECRET_KEY": "YOUR_JWT_SECRET_KEY",
  "BASE_URL": "http://localhost:3001",
  "SMTP_HOST": "smtp.gmail.com",
  "SMTP_PORT": "465",
  "SMTP_USER": "YOUR_SMTP_USER",
  "SMTP_PASS": "YOUR_SMTP_PASSWORD",
  "PGADMIN_PASSWORD": "YOUR_PGADMIN_PASSWORD",
  "PGADMIN_EMAIL": "YOUR_PGADMIN_EMAIL",
  "STRIPE_API_KEY": "YOUR_STRIPE_API_KEY",
  "MERCADO_PAGO_API_KEY": "YOUR_MERCADO_PAGO_API_KEY",
  "ENCRYPTION_KEY": "6d2e5b26b6e743e5c6f5d8d34d764d4f876a98e6cbbdcf7a4a8f17e6d0c6d9f6",
  "MODE_AES": "aes-256-cbc"
}

```

### 3. Build and Lift Containers

To build and raise the containers, run the following command:

```bash
docker-compose up --build
```

### 4. Access the Application

Once the containers are up and running, you can access the application in [http://localhost:3001](http://localhost:3001).


### Use of the Application

This application provides an API that allows you to manage wallets, make transactions, and consult information about cryptocurrencies. Here's how you can get started using the API.

#### Postman Collection

To make it easier to test and explore the API, we have prepared a Postman collection that includes all available requests and their configurations. You can import this collection into Postman to start interacting with the API easily.

1. **Download the Postman Collection**

   Click the following link to download the Postman collection:

   [Download](https://drive.google.com/file/d/1suR4gT4RbT33QAqridW1LjIIz322OrrG/view?usp=sharing)

2. **Import the Collection into Postman**

   - Open Postman.
   - Click the **Import** button in the upper left corner.
   - Select the `.json` file you downloaded.
   - The collection will be added to your Postman workspace, and you can start making requests to the API.

#### Request Examples

To get started with the API, review the examples included in the Postman collection. These examples will provide you with an overview of how to interact with the various endpoints of the API.

## Authors

- [@SebastianHinestroza12](https://github.com/SebastianHinestroza12)
