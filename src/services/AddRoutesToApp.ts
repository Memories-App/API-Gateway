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
    Description: ${description || 'No description'}
    Availble at: http://API-GATEWAY${routePath}\n`)
    app.use(routePath, async (req: any, res) => {
      try {

        const url = `${serviceURL}${path}${req.path.substring(1)}`;
        const headers: any = req.headers
        const body = req.body;
        const method = req.method;

        delete headers['content-length']
      
        const response = await fetch(url, { method: method, body: body, headers: headers });        

        const data = await response.json();
        res.json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }
};

export default addRoutesToApp;
