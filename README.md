# WhatsUT - Setup and Execution Guide

This guide explains how to set up and run the WhatsUT messaging application.

## Prerequisites

- Node.js installed (v16 or higher recommended)
- npm (Node Package Manager)

## Project Structure

The project is divided into two main folders:
- `client`: The React frontend application.
- `server`: The Node.js/Express backend application.

## Installation

You need to install dependencies for both the client and the server.

### 1. Server Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
```

### 2. Client Setup

Open a new terminal (or use the same one after finishing the server setup) and navigate to the `client` directory:

```bash
cd client
npm install
```

## Running the Application

You need to run both the server and the client simultaneously. It is recommended to use two separate terminal windows/tabs.

### 1. Start the Server

In the `server` directory:

```bash
npm start
```
*The server will start on port 3000.*

### 2. Start the Client

In the `client` directory:

```bash
npm run dev
```
*The client will typically start on port 5173 (check the terminal output for the exact URL).*

## Accessing the App

Open your browser and navigate to the URL provided by the client (usually `http://localhost:5173`).

## Troubleshooting

- **Port Conflicts**: Ensure ports 3000 and 5173 are not in use.
- **Database**: The server uses SQLite. A `whatsut.db` file will be created automatically in the parent directory of `src` when the server starts.
