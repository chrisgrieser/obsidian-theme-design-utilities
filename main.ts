import { Notice, Plugin } from "obsidian";

// add type safety for the undocumented methods
declare module "obsidian" {
	interface App {
		isMobile: () => void;
		emulateMobile: (toggle: boolean) => void;
		setTheme: (theme: string) => void;
	}
	interface Vault {
		setConfig: (config: string, newValue: string) => void;
		getConfig: (config: string) => string;
	}
}

export default class themeDesignUtilities extends Plugin {

	async onload() {

		console.log("Theme Design Utilities Plugin loaded.");
		const freezeDelaySecs = 4;
		const versionInfoNoticeDuration = 7;

		this.addCommand({
			id: "freeze-obsidian",
			name: "Freeze Obsidian (with " + freezeDelaySecs.toString() + "s delay)",
			callback: () => {
				new Notice ("Will freeze Obsidian in " + freezeDelaySecs.toString() + "s (if the console is open.)", (freezeDelaySecs - 1) * 1000);
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
			name: "Cheatsheet – Obsidian CSS Classes",
			callback: () => window.open("https://raw.githubusercontent.com/chrisgrieser/obsidian-theme-design-utilities/master/cheatsheets/css-classes.png"),
		});

		this.addCommand({
			id: "toggle-dark-light-mode",
			name: "Toggle between Dark and Light Mode",
			callback: () => this.toggleTheme(),
		});

		this.addCommand({
			id: "cycle-views",
			name: "Cycle between Source Mode, Live Preview, and Reading Mode",
			callback: () => this.cycleViews(),
		});

		this.addCommand({
			id: "version-info",
			name: "CSS Feature Compatibility / Tech Stack Versions",
			callback: () => {
				const chromeVersion = (process.versions.chrome).split(".")[0];
				const nodeVersion = (process.versions.node).split(".")[0];
				const electronVersion = (process.versions.electron).split(".")[0];
				new Notice (`Chrome Version: ${chromeVersion}\nNode Version: ${nodeVersion}\nElectron Version: ${electronVersion}`, versionInfoNoticeDuration * 1000);
			}
		});
	}

	async onunload() { console.log("Theme Design Utilities Plugin unloaded.") }


	toggleTheme() {
		const isDarkMode = this.app.vault.getConfig("theme") === "obsidian";
		if (isDarkMode) {
			this.app.setTheme("moonstone");
			this.app.vault.setConfig("theme", "moonstone");
			this.app.workspace.trigger("css-change");
		} else {
			this.app.setTheme("obsidian");
			this.app.vault.setConfig("theme", "obsidian");
			this.app.workspace.trigger("css-change");
		}
	}

	cycleViews() {
		const noticeDuration = 2000;

		const activePane = this.app.workspace.activeLeaf;
		const currentView = activePane.getViewState();
		if (currentView.type === "empty") {
			new Notice ("There is currently no file open.");
			return;
		}

		let currentMode: string;
		if (currentView.state.mode === "preview") currentMode = "preview";
		if (currentView.state.mode === "source" && currentView.state.source) currentMode = "source";
		if (currentView.state.mode === "source" && !currentView.state.source) currentMode = "live";

		const newMode = currentView;
		switch (currentMode) {
			case "preview":
				newMode.state.mode = "source";
				newMode.state.source = true;
				new Notice ("Now: Source Mode", noticeDuration);
				break;
			case "source":
				newMode.state.mode = "source";
				newMode.state.source = false;
				new Notice ("Now: Live Preview", noticeDuration);
				break;
			case "live":
				newMode.state.mode = "preview";
				new Notice ("Now: Reading Mode", noticeDuration);
				break;
		}

		activePane.setViewState(newMode);
	}

}
