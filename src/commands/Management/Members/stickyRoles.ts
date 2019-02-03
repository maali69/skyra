import { Role } from 'discord.js';
import { CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';
import { SkyraCommand } from '../../../lib/structures/SkyraCommand';
import { GuildSettingsStickyRole, GuildSettingsStickyRoles } from '../../../lib/types/Misc';

export default class extends SkyraCommand {

	public constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			bucket: 2,
			cooldown: 10,
			description: (language) => language.get('COMMAND_MANAGEROLEREACTION_DESCRIPTION'),
			extendedHelp: (language) => language.get('COMMAND_MANAGEROLEREACTION_EXTENDED'),
			permissionLevel: 6,
			quotedStringSupport: true,
			requiredPermissions: ['MANAGE_ROLES'],
			runIn: ['text'],
			subcommands: true,
			usage: '<show|add|remove|reset> (user:username) (role:rolename)',
			usageDelim: ' '
		});

		this.createCustomResolver('username', (arg, possible, msg) => {
			if (!arg) throw msg.language.get('COMMAND_STICKYROLES_REQUIRED_USER');
			return this.client.arguments.get('username').run(arg, possible, msg);
		}).createCustomResolver('rolename', (arg, possible, msg, [action]) => {
			if (action === 'reset' || (action === 'show' && !arg)) return undefined;
			if (!arg) throw msg.language.get('COMMAND_STICKYROLES_REQUIRED_ROLE');
			return this.client.arguments.get('rolename').run(arg, possible, msg);
		});
	}

	public async reset(message: KlasaMessage, [user]: [KlasaUser]) {
		const all = message.guild.settings.get('stickyRoles') as GuildSettingsStickyRoles;
		const entry = all.find((stickyRole) => stickyRole.user === user.id);
		if (!entry) throw message.language.get('COMMAND_STICKYROLES_NOTEXISTS', user.username);

		await message.guild.settings.update('stickyRoles', entry, { arrayAction: 'remove' });
		return message.sendLocale('COMMAND_STICKYROLES_RESET', [user.username]);
	}

	public async remove(message: KlasaMessage, [user, role]: [KlasaUser, Role]) {
		const all = message.guild.settings.get('stickyRoles') as GuildSettingsStickyRoles;
		const entry = all.find((stickyRole) => stickyRole.user === user.id);
		if (!entry) throw message.language.get('COMMAND_STICKYROLES_NOTEXISTS', user.username);

		const cleaned = await this._clean(message, entry);
		if (!cleaned) {
			await message.guild.settings.update('stickyRoles', entry, { arrayAction: 'remove' });
			throw message.language.get('COMMAND_STICKYROLES_NOTEXISTS', user.username);
		}

		const index = all.indexOf(entry);
		if (index !== -1 || entry.roles.length !== cleaned.raw.roles.length) {
			if (index !== -1) {
				const indexRole = cleaned.raw.roles.indexOf(role.id);
				cleaned.raw.roles.splice(indexRole, 1);
			}
			await message.guild.settings.update('stickyRoles', { user: entry.user, roles: cleaned.raw.roles }, { arrayIndex: index });
		}

		return message.sendLocale(index === -1 ? 'COMMAND_STICKYROLES_NOTEXISTS' : 'COMMAND_STICKYROLES_REMOVE', [user.username]);
	}

	public async add(message: KlasaMessage, [user, role]: [KlasaUser, Role]) {
		const all = message.guild.settings.get('stickyRoles') as GuildSettingsStickyRoles;
		const entry = all.find((stickyRole) => stickyRole.user === user.id);

		if (!entry) {
			await message.guild.settings.update('stickyRoles', { user: user.id, roles: [role.id] });
		} else {
			const cleaned = await this._clean(message, entry);
			if (!cleaned) {
				await message.guild.settings.update('stickyRoles', { user: user.id, roles: [role.id] }, { arrayIndex: all.indexOf(entry) });
			} else if (cleaned.raw.roles.includes(role.id)) {
				throw message.language.get('COMMAND_STICKYROLES_ADD_EXISTS', [user.username]);
			} else {
				cleaned.raw.roles.push(role.id);
			}
			await message.guild.settings.update('stickyRoles', cleaned.raw, { arrayIndex: all.indexOf(entry) });
		}

		return message.sendLocale('COMMAND_STICKYROLES_ADD', [user.username]);
	}

	public async show(message: KlasaMessage, [user]: [KlasaUser]) {
		const all = message.guild.settings.get('stickyRoles') as GuildSettingsStickyRoles;
		if (user) {
			const entry = all.find((stickyRole) => stickyRole.user === user.id);
			if (!entry) throw message.language.get('COMMAND_STICKYROLES_SHOW_EMPTY');

			const cleaned = await this._clean(message, entry);
			if (!cleaned) {
				await message.guild.settings.update('stickyRoles', entry, { arrayAction: 'remove' });
				throw message.language.get('COMMAND_STICKYROLES_SHOW_EMPTY');
			}

			if (cleaned.raw.roles.length !== entry.roles.length) {
				const index = all.indexOf(entry);
				await message.guild.settings.update('stickyRoles', entry, { arrayIndex: index });
			}

			return message.sendLocale('COMMAND_STICKYROLES_SHOW_SINGLE', [cleaned.resolved.user, cleaned.resolved.roles]);
		}

		const raw = [];
		const resolved = [];
		let dirty = false;
		for (const entry of all) {
			const cleaned = await this._clean(message, entry);
			if (cleaned) {
				if (cleaned.raw.roles.length !== entry.roles.length) dirty = true;
				resolved.push(cleaned.resolved);
				raw.push(cleaned.raw);
			} else {
				dirty = true;
			}
		}

		if (!resolved.length) {
			await message.guild.settings.reset('stickyRoles');
			throw message.language.get('COMMAND_STICKYROLES_SHOW_EMPTY');
		}
		if (dirty) await message.guild.settings.update('stickyRoles', raw, { arrayAction: 'overwrite' });

		return message.sendLocale('COMMAND_STICKYROLES_SHOW', [resolved]);
	}

	private async _clean(message: KlasaMessage, entry: GuildSettingsStickyRole) {
		const roles = [] as string[];
		const ids = [] as string[];
		for (const role of entry.roles) {
			const resolved = message.guild.roles.get(role);
			if (resolved) {
				roles.push(resolved.name);
				ids.push(role);
			}
		}

		if (!roles.length) return null;

		try {
			const user = await this.client.fetchUsername(entry.user);
			if (user) return {
				raw: {
					roles: ids,
					user: entry.user
				},
				resolved: {
					roles,
					user
				}
			};
		} catch {} // tslint:disable-line:no-empty
		return null;
	}

}