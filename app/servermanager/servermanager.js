import config from '../config/config.json';
import MinecraftRunner from 'minecraft-runner';
import messageBus from '../util/MessageBusProvider';

class ServerManager {
	constructor()
	{
		this.gameInstance = new MinecraftRunner(config.minecraftDir, config.minecraftJar, {
			ram: config.ram
		});
	}

	start()
	{
		this.gameInstance.start((err, proc) => {
			if(err) throw err;
			messageBus.emit("server.started", {
				proc: proc
			});
		});
		this.gameInstance.on('log', (log) => this.onLog(log));
	}

	static onLog(log)
	{
		console.log("[Minecraft Server] ", log);
	}
}

export default ServerManager;