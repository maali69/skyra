import { Command, CommandOptions, CommandStore, KlasaClient, KlasaMessage, util } from 'klasa';
import { SkyraClient } from '../SkyraClient';

export class SkyraCommand extends Command {

	public client: SkyraClient;
	public spam: boolean;

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string, options: SkyraCommandOptions) {
		super(client, store, file, directory, util.mergeDefault({ spam: false }, options));
		this.spam = options.spam;
	}

	// @ts-ignore
	public inhibit(message: KlasaMessage) {
		return false;
	}

}

export interface SkyraCommandOptions extends CommandOptions {
	spam?: boolean;
}