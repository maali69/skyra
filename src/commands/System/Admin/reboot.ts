import { CommandStore, KlasaClient, KlasaMessage } from 'klasa';
import { SkyraCommand } from '../../../lib/structures/SkyraCommand';

export default class extends SkyraCommand {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			description: (language) => language.get('COMMAND_REBOOT_DESCRIPTION'),
			guarded: true,
			permissionLevel: 10
		});
	}

	public async run(message: KlasaMessage) {
		await message.sendLocale('COMMAND_REBOOT').catch((err) => this.client.emit('apiError', err));

		try {
			this.client.destroy();
			await Promise.all(this.client.providers.map((provider) => provider.shutdown()));
		} catch (error) {} // tslint:disable-line:no-empty

		process.exit();
		return null;
	}

}