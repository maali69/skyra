import { MoveEntry } from '@favware/graphql-pokemon';
import { toTitleCase } from '@klasa/utils';
import { DbSet } from '@lib/structures/DbSet';
import { RichDisplayCommand, RichDisplayCommandOptions } from '@lib/structures/RichDisplayCommand';
import { UserRichDisplay } from '@lib/structures/UserRichDisplay';
import { CdnUrls } from '@lib/types/Constants';
import { ApplyOptions } from '@skyra/decorators';
import { BrandingColors } from '@utils/constants';
import { fetchGraphQLPokemon, getMoveDetailsByFuzzy, parseBulbapediaURL } from '@utils/Pokemon';
import { MessageEmbed } from 'discord.js';
import { KlasaMessage } from 'klasa';

@ApplyOptions<RichDisplayCommandOptions>({
	cooldown: 10,
	description: (language) => language.get('COMMAND_MOVE_DESCRIPTION'),
	extendedHelp: (language) => language.get('COMMAND_MOVE_EXTENDED'),
	usage: '<move:str>'
})
export default class extends RichDisplayCommand {
	public async run(message: KlasaMessage, [move]: [string]) {
		const response = await message.sendEmbed(
			new MessageEmbed().setDescription(message.language.get('SYSTEM_LOADING')).setColor(BrandingColors.Secondary)
		);
		const moveData = await this.fetchAPI(message, move.toLowerCase());

		const display = await this.buildDisplay(message, moveData);
		await display.start(response, message.author.id);
		return response;
	}

	private async fetchAPI(message: KlasaMessage, move: string) {
		try {
			const { data } = await fetchGraphQLPokemon<'getMoveDetailsByFuzzy'>(getMoveDetailsByFuzzy, { move });
			return data.getMoveDetailsByFuzzy;
		} catch {
			throw message.language.get('COMMAND_MOVE_QUERY_FAIL', { move });
		}
	}

	private async buildDisplay(message: KlasaMessage, moveData: MoveEntry) {
		const embedTranslations = message.language.get('COMMAND_MOVE_EMBED_DATA');
		const externalResources = message.language.get('SYSTEM_POKEDEX_EXTERNAL_RESOURCE');
		const externalSources = [
			`[Bulbapedia](${parseBulbapediaURL(moveData.bulbapediaPage)} )`,
			`[Serebii](${moveData.serebiiPage})`,
			`[Smogon](${moveData.smogonPage})`
		].join(' | ');

		const display = new UserRichDisplay(
			new MessageEmbed()
				.setColor(await DbSet.fetchColor(message))
				.setAuthor(`${embedTranslations.MOVE} - ${toTitleCase(moveData.name)}`, CdnUrls.Pokedex)
				.setDescription(moveData.desc || moveData.shortDesc)
		)
			.addPage((embed: MessageEmbed) =>
				embed
					.addField(embedTranslations.TYPE, moveData.type, true)
					.addField(embedTranslations.BASE_POWER, moveData.basePower, true)
					.addField(embedTranslations.PP, moveData.pp, true)
					.addField(embedTranslations.ACCURACY, `${moveData.accuracy}%`, true)
					.addField(externalResources, externalSources)
			)
			.addPage((embed: MessageEmbed) =>
				embed
					.addField(embedTranslations.CATEGORY, moveData.category, true)
					.addField(embedTranslations.PRIORITY, moveData.priority, true)
					.addField(embedTranslations.TARGET, moveData.target, true)
					.addField(embedTranslations.CONTEST_CONDITION, moveData.contestType ?? embedTranslations.NONE, true)
					.addField(externalResources, externalSources)
			);

		// If the move has zMovePower or maxMovePower then squeeze it in between as a page
		if (moveData.zMovePower || moveData.maxMovePower) {
			display.addPage((embed: MessageEmbed) => {
				if (moveData.maxMovePower) embed.addField(embedTranslations.MAX_MOVE_POWER, moveData.maxMovePower);
				if (moveData.zMovePower) embed.addField(embedTranslations.Z_MOVE_POWER, moveData.zMovePower);

				embed.addField(externalResources, externalSources);
				return embed;
			});
		}

		return display.addPage((embed: MessageEmbed) =>
			embed
				.addField(embedTranslations.Z_CRYSTAL, moveData.isZ ?? embedTranslations.NONE, true)
				.addField(embedTranslations.GMAX_POKEMON, moveData.isGMax ?? embedTranslations.NONE)
				.addField(
					embedTranslations.AVAILABLE_IN_GENERATION_8_TITLE,
					embedTranslations.AVAILABLE_IN_GENERATION_8_DATA({ available: moveData.isNonstandard !== 'Past' })
				)
				.addField(externalResources, externalSources)
		);
	}
}
