import { Notice, Plugin } from "obsidian";

declare module "obsidian" {
	// to add type safety of the undocumented methods
	interface App {
		emulateMobile: (toggle: boolean) => void;
		isMobile: () => void;
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
			id: "toggle-emulate-mobile",
			name: "Toggle mobile emulation",
			callback: () => {
				if (this.app.isMobile) this.app.emulateMobile(false);
				else this.app.emulateMobile(true);
			},
		});
		this.addCommand({
			id: "open-url",
			name: "Open URL",
			callback: () => {
				window.open("https://github.com/chrisgrieser/obsidian-theme-design-utilities")
			},
		});

		console.log("Theme Design Utilities Plugin loaded.");
	}

	async onunload() {
		console.log("Theme Design Utilities Plugin unloaded.");
	}
}
