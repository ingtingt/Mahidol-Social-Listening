# Deployment Instructions:

1. Unzip the project folder on the server.

2. Create an Environment File: Create a file named .env in the folder and add your Google API Key: GOOGLE_API_KEY=AIza...

3. Start the Application: Run the following command:

```
docker-compose --env-file .env up -d --build
```

4. Initialize Database: Run this command once to create tables and import the dataset:

```
docker exec -it muic_dashboard_web npm run docker:init
```

5. Access: The dashboard is now running at http://localhost:3000 (or the server's IP address).
