// add RouteToApp.ts

import express from 'express';
import { LoggingTool } from './loggingTool';

const addRoutesToApp = async (app: express.Application, service: string, serviceURL: string, routes: any[]) => {
  for (const route of routes) {
    const { method, path, description } = route;
    const routePath = `/${service}${path}`;
    LoggingTool.info(`Adding Route
    Path: ${path}
    Method: ${method}
    Description: ${description}
    Availble at: http://API-GATEWAY${routePath}\n`)
    app.use(routePath, async (req, res) => {
      try {
        const response = await fetch(`${serviceURL}${path}${req.path.substring(1)}`, { method: req.method, body: req.body });        

        const data = await response.json();
        res.json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }
};

export default addRoutesToApp;
