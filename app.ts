import express from 'express';
import { microservicesProd, microservicesDev } from './config/microservices';
import { LoggingTool } from './src/services/loggingTool';
import addRoutesToApp from './src/services/AddRoutesToApp';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
let microservices: Object;

const environment = process.env.ENV || 'production';

if (environment === 'production') {
  LoggingTool.info('Using Production Microservices');
  microservices = microservicesProd;
} else {
  LoggingTool.info('Using Development Microservices');
  microservices = microservicesDev;
}

const retryDelay = 15 * 1000; // Retry every 15 seconds
const maxRetryAttempts = 15; // Maximum number of retry attempts

const startServer = async () => {
  // Retry until all microservices are running and registered
  let retryAttempts = 0;
  let allMicroservicesRunning = false;

  while (!allMicroservicesRunning && retryAttempts < maxRetryAttempts) {
    try {
      allMicroservicesRunning = true; // Assume all microservices are running

      for (const [service, serviceURL] of Object.entries(microservices)) {
        LoggingTool.info(`Retrieving ${service} Information from ${serviceURL}`);
        const response = await fetch(serviceURL);
        const data = await response.json();

        if (data.status !== 'running') {
          allMicroservicesRunning = false; // Set flag to false if any microservice is not running
          LoggingTool.warning(`Service ${service} is not running yet`);
        } else {
          LoggingTool.success(`Service ${service} is running`);
          await addRoutesToApp(app, service, serviceURL, data.routes);
        }
      }
    } catch (error: any) {
      allMicroservicesRunning = false; // Set flag to false if an error occurs
      LoggingTool.error(error);
    }

    if (!allMicroservicesRunning) {
      retryAttempts++;
      LoggingTool.info(`Retry attempt ${retryAttempts}/${maxRetryAttempts}`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  if (allMicroservicesRunning) {
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      LoggingTool.info(`API Gateway listening at http://localhost:${port}`);
    });
  } else {
    LoggingTool.error('Failed to start the server. Maximum number of retry attempts reached.');
  }
};

startServer();
