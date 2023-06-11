// app.ts

import express from 'express';
import { microservicesProd, microservicesDev } from './config/microservices';
import { LoggingTool } from './src/services/loggingTool';
import addRoutesToApp from './src/services/addRoutesToApp';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
let microservices: Object;

const enviroment = process.env.ENV || 'production';

if (enviroment === 'production') {
  LoggingTool.info('Using Production Microservices');
  microservices = microservicesProd;
} else {
  LoggingTool.info('Using Development Microservices');
  microservices = microservicesDev;
}
  

// Retrieve service information and routes from microservices
(async () => {
  for (const [service, serviceURL] of Object.entries(microservices)) {
    try {
      // Check if service is running
      LoggingTool.info(`Retrieving ${service} Information from ${serviceURL}`);
      const response = await fetch(serviceURL);
      const data = await response.json();

      if (data.status !== 'running') {
        throw new Error(`Service ${service} is not running`);
      }

      // Log Service Information
      LoggingTool.success(`Service ${service} is running`);
      
      // Add routes to express app
      await addRoutesToApp(app, service, serviceURL, data.routes);
    } catch (error) {
      console.error(error);
    }
  }

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    LoggingTool.info(`API Gateway listening at http://localhost:${port}`);
  });
})();