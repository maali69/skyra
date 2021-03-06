import { LanguageKeys } from '#lib/i18n/languageKeys';
import { WeebCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<WeebCommand.Options>({
	description: LanguageKeys.Commands.Weeb.CryDescription,
	extendedHelp: LanguageKeys.Commands.Weeb.CryExtended,
	queryType: 'cry',
	responseName: LanguageKeys.Commands.Weeb.Cry,
	usage: '<user:username>'
})
export default class extends WeebCommand {}
