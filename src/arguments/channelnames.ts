import { Argument, MultiArgument } from 'klasa';

export default class extends MultiArgument {
	public get base() {
		return this.store.get('channelname') as Argument;
	}
}
