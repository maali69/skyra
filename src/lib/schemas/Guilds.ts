import { Client } from 'klasa';

export default Client.defaultGuildSchema
	.add('commandUses', 'Integer', { 'default': 0, 'configurable': false })
	.add('prefix', 'string', { filter: (_client, value: string) => value.length > 10 })
	.add('tags', 'any', { array: true, configurable: false })
	.add('permissions', folder => folder
		.add('users', 'PermissionNode', { array: true, configurable: false })
		.add('roles', 'PermissionNode', { array: true, configurable: false }))
	.add('channels', folder => folder
		.add('announcements', 'TextChannel')
		.add('greeting', 'TextChannel')
		.add('farewell', 'TextChannel')
		.add('member-logs', 'TextChannel')
		.add('message-logs', 'TextChannel')
		.add('moderation-logs', 'TextChannel')
		.add('nsfw-message-logs', 'TextChannel')
		.add('image-logs', 'TextChannel')
		.add('roles', 'TextChannel')
		.add('spam', 'TextChannel'))
	.add('command-autodelete', 'any', { array: true })
	.add('disabledChannels', 'TextChannel', { array: true })
	.add('disabledCommandsChannels', 'any', { array: true, configurable: false })
	.add('events', folder => folder
		.add('banAdd', 'Boolean', { 'default': false })
		.add('banRemove', 'Boolean', { 'default': false })
		.add('memberAdd', 'Boolean', { 'default': false })
		.add('memberRemove', 'Boolean', { 'default': false })
		.add('messageDelete', 'Boolean', { 'default': false })
		.add('messageEdit', 'Boolean', { 'default': false }))
	.add('messages', folder => folder
		.add('farewell', 'String', { max: 2000 })
		.add('greeting', 'String', { max: 2000 })
		.add('join-dm', 'String', { max: 1500 })
		.add('warnings', 'Boolean', { 'default': false })
		.add('ignoreChannels', 'TextChannel', { array: true }))
	.add('stickyRoles', 'any', { array: true })
	.add('roles', folder => folder
		.add('admin', 'Role')
		.add('auto', 'any', { array: true })
		.add('initial', 'Role')
		.add('messageReaction', 'String', { min: 17, max: 18, configurable: false })
		.add('moderator', 'Role')
		.add('muted', 'Role')
		.add('public', 'Role', { array: true })
		.add('reactions', 'any', { array: true })
		.add('removeInitial', 'Boolean')
		.add('staff', 'Role')
		.add('dj', 'Role')
		.add('subscriber', 'Role')
		.add('uniqueRoleSets', 'any', { array: true }))
	.add('selfmod', folder => folder
		.add('attachment', 'Boolean', { 'default': false })
		.add('attachmentMaximum', 'Integer', { 'default': 20, 'min': 0, 'max': 60 })
		.add('attachmentDuration', 'Integer', { 'default': 20000, 'min': 5000, 'max': 120000, 'configurable': false })
		.add('attachmentAction', 'Integer', { 'default': 0, 'configurable': false })
		.add('attachmentPunishmentDuration', 'Integer', { configurable: false })
		.add('capitals', capitals => capitals
			.add('enabled', 'Boolean', { 'default': false })
			.add('minimum', 'Integer', { 'default': 15, 'min': 5, 'max': 2000 })
			.add('maximum', 'Integer', { 'default': 50, 'min': 10, 'max': 100 })
			.add('softAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardActionDuration', 'Integer', { min: 1000, configurable: false })
			.add('thresholdMaximum', 'Integer', { 'default': 10, 'min': 0, 'max': 60, 'configurable': false })
			.add('thresholdDuration', 'Integer', { 'default': 60000, 'min': 0, 'max': 120000, 'configurable': false }))
		.add('newlines', newline => newline
			.add('enabled', 'Boolean', { 'default': false })
			.add('maximum', 'Integer', { 'default': 20, 'min': 10, 'max': 2000 })
			.add('softAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardActionDuration', 'Integer', { min: 1000, configurable: false })
			.add('thresholdMaximum', 'Integer', { 'default': 10, 'min': 0, 'max': 60, 'configurable': false })
			.add('thresholdDuration', 'Integer', { 'default': 60000, 'min': 0, 'max': 120000, 'configurable': false }))
		.add('invites', invites => invites
			.add('enabled', 'Boolean', { 'default': false })
			.add('softAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardActionDuration', 'Integer', { min: 1000, configurable: false })
			.add('thresholdMaximum', 'Integer', { 'default': 10, 'min': 0, 'max': 60, 'configurable': false })
			.add('thresholdDuration', 'Integer', { 'default': 60000, 'min': 0, 'max': 120000, 'configurable': false }))
		.add('filter', filter => filter
			.add('raw', 'String', { array: true, configurable: false })
			.add('enabled', 'Boolean', { 'default': false })
			.add('softAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardAction', 'Integer', { 'default': 0, 'configurable': false })
			.add('hardActionDuration', 'Integer', { min: 1000, configurable: false })
			.add('thresholdMaximum', 'Integer', { 'default': 10, 'min': 0, 'max': 60, 'configurable': false })
			.add('thresholdDuration', 'Integer', { 'default': 60000, 'min': 0, 'max': 120000, 'configurable': false }))
		.add('raid', 'Boolean')
		.add('raidthreshold', 'Integer', { 'default': 10, 'min': 2, 'max': 50 })
		.add('ignoreChannels', 'TextChannel', { array: true }))
	.add('no-mention-spam', folder => folder
		.add('enabled', 'Boolean', { 'default': false })
		.add('alerts', 'Boolean', { 'default': false })
		.add('mentionsAllowed', 'Integer', { 'default': 20 })
		.add('timePeriod', 'Integer', { 'default': 8 }))
	.add('social', folder => folder
		.add('achieve', 'Boolean', { 'default': false })
		.add('achieveMessage', 'String')
		.add('ignoreChannels', 'TextChannel', { array: true }))
	.add('starboard', folder => folder
		.add('channel', 'TextChannel')
		.add('emoji', 'String', { 'default': '%E2%AD%90', 'configurable': false })
		.add('ignoreChannels', 'TextChannel', { array: true })
		.add('minimum', 'Integer', { 'default': 1, 'min': 1, 'max': 20 }))
	.add('trigger', folder => folder
		.add('alias', 'any', { array: true, configurable: false })
		.add('includes', 'any', { array: true, configurable: false }));