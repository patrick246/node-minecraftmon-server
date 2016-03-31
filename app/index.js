/**
 * @SwaggerHeader
 * info:
 *  title: Node Minecraft Monitor REST API
 *  description: REST API for managing a Minecraft server
 *  version: 0.0.1
 * basePath: /api
 */
import ServerManager from './servermanager/ServerManager.js';

var serverManager = new ServerManager();
serverManager.start();