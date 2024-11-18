# Chat Backend

## Overview

Chat Backend is a Node.js application that provides the backend for a chat system. It uses Express as the web framework and postgres as the database. The application includes support for authentication using a secret key and can be configured to run on a specified port, defaulting to port 2001 if not specified.

The deployment guide includes Docker and Kubernetes configurations, with Horizontal Pod Autoscaling (HPA) to scale the application based on CPU utilization.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Installation and Running the Server](#installation-and-running-the-server)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Enabling Autoscaling](#enabling-autoscaling)
- [Accessing the Application](#accessing-the-application)
- [Cleanup](#cleanup)
- [Notes](#notes)

---

## Setup Instructions

### Step 1: Configure Environment Variables

The application requires the following environment variables for configuration:

1. In the root directory, create a .env file.
2. Add the required environment variables as shown below:

plaintext
# postgres Configuration
DATABASE_URL=your_postgres_connection_string_here

# Application Port (defaults to 2001 if not specified)
PORT=2001  

# Secret Key for Authentication
SECRET_KEY=your_secret_key_here


Replace each placeholder (e.g., your_mongodb_connection_string_here) with your actual values.

---

## Installation and Running the Server

1. *Install Dependencies*

   Run the following command to install the required packages:

   bash
   npm install
   

2. *Start the Server in Production Mode*

   Use node index.js to start the server in production mode:

   bash
   node index.js
   

   The server will start on port 2001 by default or on the port specified in the .env file.

---

## Docker Setup

To deploy this application in a Docker container:

1. *Create a Dockerfile*:

    dockerfile
    # Use the Node.js LTS image
    FROM node:lts

    # Set the working directory
    WORKDIR /app

    # Copy package.json and package-lock.json
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Expose the application port (default is 2001)
    EXPOSE 2001

    # Start the application in production mode
    CMD ["node", "index.js"]
    

2. *Build the Docker Image*:

   bash
   docker build -t chat-backend:latest .
   

3. *Run the Docker Container*:

   bash
   docker run -p 2001:2001 --env-file .env chat-backend:latest
---
# API Documentation

## Base URL
```
http://<your-domain>/api/v1
```

## Endpoints

### User Registration
- **URL:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "email": "user@example.com",
      "token": "jwt_token",
      "otp": "123456"
    }
  }
  ```

### User Login
- **URL:** `/login`
- **Method:** `POST`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User login successfully",
    "data": {
      "email": "user@example.com",
      "token": "jwt_token",
      "otp": "123456",
      "isVerifyed": false,
      "isTwoFactorEnabled": true
    }
  }
  ```

### Forgot Password
- **URL:** `/forgot-password`
- **Method:** `POST`
- **Description:** Sends a password reset email.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "forgot email sent successfully",
    "data": {
      "otp": "123456",
      "token": "jwt_token"
    }
  }
  ```

### Resend Email
- **URL:** `/resend-email`
- **Method:** `POST`
- **Description:** Resends the verification email.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "otp sent successfully",
    "data": {
      "otp": "123456",
      "email": "user@example.com"
    }
  }
  ```

### Verify User
- **URL:** `/verify-user`
- **Method:** `POST`
- **Description:** Verifies a user.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "verification successfully",
    "data": {
      "message": "verification updated"
    }
  }
  ```

### Update Password
- **URL:** `/update-password`
- **Method:** `POST`
- **Description:** Updates the user's password.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "password": "new_password"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "password updated successfully",
    "data": {
      "message": "password updated"
    }
  }
  ```

### Update Profile
- **URL:** `/update-profile`
- **Method:** `POST`
- **Description:** Updates the user's profile.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "profileImage": "new_image_url",
    "about": "new_about",
    "age": 25,
    "userName": "new_username"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "profile update successfully",
    "data": {
      "profileImage": "new_image_url",
      "about": "new_about",
      "age": 25,
      "userName": "new_username"
    }
  }
  ```

### Get User Details
- **URL:** `/get-user-details`
- **Method:** `POST`
- **Description:** Retrieves the user's details.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "profile update successfully",
    "data": {
      "email": "user@example.com",
      "profileImage": "profile_image_url",
      "about": "about",
      "age": 25,
      "userName": "username"
    }
  }
  ```

### Send Friend Request
- **URL:** `/sent-request`
- **Method:** `POST`
- **Description:** Sends a friend request.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "to": "user_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Request sent successfully."
  }
  ```

### Accept Friend Request
- **URL:** `/accept-request`
- **Method:** `POST`
- **Description:** Accepts a friend request.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "to": "user_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Request accepted successfully."
  }
  ```

### Reject Friend Request
- **URL:** `/reject-request`
- **Method:** `POST`
- **Description:** Rejects a friend request.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "to": "user_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Request rejected successfully."
  }
  ```

### Get All Sent Requests
- **URL:** `/get-all-user-sent-requests`
- **Method:** `POST`
- **Description:** Retrieves all sent friend requests.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": [
      {
        "id": "user_id",
        "user_name": "username",
        "about": "about",
        "profile_image": "profile_image_url"
      }
    ]
  }
  ```

### Get All Accepted Requests
- **URL:** `/get-all-users-accept-requests`
- **Method:** `POST`
- **Description:** Retrieves all accepted friend requests.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Users list retrieved successfully",
    "data": [
      {
        "id": "user_id",
        "user_name": "username",
        "about": "about",
        "profile_image": "profile_image_url"
      }
    ]
  }
  ```

### Get All Friends
- **URL:** `/get-all-friends`
- **Method:** `POST`
- **Description:** Retrieves all friends.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Friends list retrieved successfully",
    "data": [
      {
        "id": "user_id",
        "user_name": "username",
        "about": "about",
        "profile_image": "profile_image_url"
      }
    ]
  }
  ```

### Create Group
- **URL:** `/create-group`
- **Method:** `POST`
- **Description:** Creates a new group.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "groupName": "group_name",
    "about": "group_about",
    "profileImage": "group_profile_image"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Group created successfully"
  }
  ```

### Join Group
- **URL:** `/join-group`
- **Method:** `POST`
- **Description:** Joins an existing group.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "groupId": "group_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Group joined successfully"
  }
  ```

### Get All Groups
- **URL:** `/get-all-groups`
- **Method:** `POST`
- **Description:** Retrieves all groups the user is a member of.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Groups retrieved successfully",
    "data": [
      {
        "id": "group_id",
        "groupName": "group_name",
        "about": "group_about",
        "profileImage": "group_profile_image"
      }
    ]
  }
  ```

### Get All Groups to Join
- **URL:** `/get-all-groups-join`
- **Method:** `POST`
- **Description:** Retrieves all groups the user can join.
- **Request Body:**
  ```json
  {
    "token": "jwt_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Groups available to join",
    "data": [
      {
        "id": "group_id",
        "groupName": "group_name",
        "about": "group_about",
        "profileImage": "group_profile_image"
      }
    ]
  }
  ```

### Get Chat Details
- **URL:** `/get-chat-details`
- **Method:** `POST`
- **Description:** Retrieves chat details for a user or group.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "chatId": "chat_id",
    "chatType": "friend|group"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Chat details retrieved successfully",
    "data": {
      "id": "chat_id",
      "user_name": "username",
      "about": "about",
      "profile_image": "profile_image_url"
    },
    "userId": "user_id"
  }
  ```

### Get Messages
- **URL:** `/get-messages`
- **Method:** `POST`
- **Description:** Retrieves messages for a user or group chat.
- **Request Body:**
  ```json
  {
    "token": "jwt_token",
    "chatId": "chat_id",
    "chatType": "friend|group"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Messages retrieved successfully",
    "data": [
      {
        "from": "user_id",
        "to": "chat_id",
        "message": "message_content",
        "messageType": "TEXT|IMAGE|VIDEO",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
  }
  ```

## WebSocket Events

### Send Message
- **Event:** `sendMessage`
- **Description:** Sends a message to a user or group.
- **Payload:**
  ```json
  {
    "token": "jwt_token",
    "to": "recipient_id",
    "chatType": "friend|group",
    "message": "message_content",
    "messageType": "TEXT|IMAGE|VIDEO"
  }
  ```
- **Response:**
  ```json
  {
    "to": "recipient_id",
    "from": "sender_id"
  }
  ```

### New Message
- **Event:** `newMessage`
- **Description:** Receives a new message notification.
- **Payload:**
  ```json
  {
    "to": "recipient_id",
    "from": "sender_id"
  }
  ```

This documentation covers the main API endpoints and WebSocket events for your chat backend application.


---

## Kubernetes Deployment

To deploy this application on Kubernetes, follow these steps:

1. *Create the ConfigMap for Environment Variables*

   Use the .env file to create a ConfigMap to manage environment variables in Kubernetes:

   bash
   kubectl create configmap chat-backend-config --from-env-file=.env
   

2. *Create a Deployment YAML file*

   Create a deployment.yaml file with the following configuration:

   yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: chat-backend
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: chat-backend
     template:
       metadata:
         labels:
           app: chat-backend
       spec:
         containers:
         - name: chat-backend
           image: chat-backend:latest
           ports:
           - containerPort: 2001
           env:
           - name: DB_URL
             valueFrom:
               configMapKeyRef:
                 name: chat-backend-config
                 key: DATABASE_URL
           - name: PORT
             valueFrom:
               configMapKeyRef:
                 name: chat-backend-config
                 key: PORT
           - name: SECRET_KEY
             valueFrom:
               configMapKeyRef:
                 name: chat-backend-config
                 key: SECRET_KEY
   

3. *Apply the Deployment*

   Deploy the application on Kubernetes:

   bash
   kubectl apply -f deployment.yaml
   

4. *Expose the Deployment as a Service*

   Expose the deployment to make it accessible externally:

   bash
   kubectl expose deployment chat-backend --type=LoadBalancer --name=chat-backend-service --port=2001
   

---

## Enabling Autoscaling

To enable autoscaling based on CPU usage, create a Horizontal Pod Autoscaler (HPA) to automatically scale the deployment based on CPU utilization.

1. *Enable metrics-server* on your cloud-based Kubernetes cluster (required for autoscaling). Metrics-server is typically available on platforms like AWS EKS, Google GKE, or Azure AKS.

2. *Create the HPA Configuration*

   Create a hpa.yaml file with the following configuration to autoscale when CPU usage exceeds 60%:

   yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: chat-backend-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: chat-backend
     minReplicas: 1
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 60
   

3. *Apply the HPA*

   Apply the autoscaler configuration with the following command:

   bash
   kubectl apply -f hpa.yaml
   

   This configuration will automatically adjust the number of pods based on CPU utilization, scaling up when usage exceeds 60% and scaling down when it falls below.

---

## Accessing the Application

1. *Retrieve the LoadBalancer IP*:
   Use the following command to get the external IP address assigned to the chat-backend-service LoadBalancer:

    bash
    kubectl get service chat-backend-service
    

2. *Access the Application*:
   Open your browser and navigate to http://<LoadBalancer-IP>:2001 (replace <LoadBalancer-IP> with the IP address retrieved above).

---

## Cleanup

To remove all resources when you’re done, delete the deployment, service, and autoscaler:

   bash
   kubectl delete deployment chat-backend
   kubectl delete service chat-backend-service
   kubectl delete hpa chat-backend-hpa
   kubectl delete configmap chat-backend-config
   

---

## Notes

- *Environment Configuration*: Ensure that the .env file contains the correct environment variables for MongoDB, port, and the secret key before creating the ConfigMap.
- *Port Configuration*: By default, the application runs on port 2001, but this can be changed by setting a PORT value in the .env file.
- *Secure Environment Variables*: For production environments, consider using Kubernetes Secrets instead of ConfigMaps for sensitive data like database URLs and API keys.
- *Autoscaling*: Adjust the autoscaling threshold or CPU utilization limit in the HPA configuration (hpa.yaml) based on the expected load and resource requirements.