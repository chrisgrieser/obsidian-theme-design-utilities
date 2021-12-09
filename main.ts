import { Notice, Plugin } from "obsidian";

declare module "obsidian" {
	// add type safety for the undocumented methods
	interface App { // eslint-disable-line no-shadow
		emulateMobile: (toggle: boolean) => void;
		isMobile: () => void;
	}
}

export default class themeDesignUtilities extends Plugin {

	async onload() {

		const freezeDelaySecs = 4;
		console.log("Theme Design Utilities Plugin loaded.");

		this.addCommand({
			id: "freeze-obsidian",
			name: "Freeze Obsidian (triggered with " + freezeDelaySecs.toString() + "s delay)",
			callback: () => {
				new Notice ("Will freeze Obsidian in " + freezeDelaySecs.toString() + "s (if the console is open.)", 3000); // eslint-disable-line no-magic-numbers
				setTimeout(() => {debugger}, freezeDelaySecs * 1000);
			},
		});

		this.addCommand({
			id: "test-notice",
			name: "Test Notice",
			callback: () => new Notice ("I am a test notice. 👋 \n\nI will stay here until you click me.", 0),
		});

		this.addCommand({
			id: "toggle-emulate-mobile",
			name: "Toggle mobile emulation",
			callback: () => this.app.emulateMobile(!this.app.isMobile),
		});

		this.addCommand({
			id: "cheatsheet-css-classes",
			name: "Cheatsheet: Obsidian CSS Classes",
			callback: () => window.open("https://raw.githubusercontent.com/chrisgrieser/obsidian-theme-design-utilities/master/cheatsheets/css-classes.png"),
		});

		this.addCommand({
			id: "toggle-dark-light-mode",
			name: "Toggle Dark/Light Mode",
			callback: () => {
				const isDarkMode = this.app.vault.getConfig("theme") === "obsidian";
				if (isDarkMode) this.useLightMode();
				else this.useDarkMode();
			}
		});
	}

	async onunload() { console.log("Theme Design Utilities Plugin unloaded.") }

	useDarkMode() {
		this.app.setTheme("obsidian");
		this.app.vault.setConfig("theme", "obsidian");
		this.app.workspace.trigger("css-change");
	}

	useLightMode() {
		this.app.setTheme("moonstone");
		this.app.vault.setConfig("theme", "moonstone");
		this.app.workspace.trigger("css-change");
	}
}
