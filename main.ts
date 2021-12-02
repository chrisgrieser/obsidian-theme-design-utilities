import { App, Notice, Plugin } from "obsidian";

declare module "obsidian" {
	interface App {
		emulateMobile: (toggle: boolean) => void;
	}
}

export default class themeDesignUtilities extends Plugin {

	async onload() {

		this.addCommand({
			id: "test-notice",
			name: "Test Notice",
			callback: () => new Notice ("I am a test notice. I will stay here until you click me. ", 0),
		});
		this.addCommand({
			id: "emulate-mobile-on",
			name: "Turn ON mobile emulation",
			callback: () => this.app.emulateMobile(true),
		});
		this.addCommand({
			id: "emulate-mobile-off",
			name: "Turn OFF mobile emulation",
			callback: () => this.app.emulateMobile(false),
		});

		console.log("Theme Design Utilities Plugin loaded.");
	}

	async onunload() {
		console.log("Theme Design Utilities Plugin unloaded.");
	}
}
