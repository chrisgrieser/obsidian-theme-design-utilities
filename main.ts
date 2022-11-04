import { MarkdownView, Notice, Plugin } from "obsidian";

// add type safety for the undocumented methods
declare module "obsidian" {
	interface App {
		isMobile: () => boolean;
		emulateMobile: (toggle: boolean) => void;
		setTheme: (mode: string) => void; // dark mode
		customCss: {
			setTheme: (theme: string) => void; // sets theme
			theme: string; // get current theme
			themes: unknown[]; // get installed themes
			oldThemes: string[]; // get legacy themes (prior to 0.16)
		};
		dom: {
			appContainerEl: {
				addClass: (cssclass: string) => void;
				classList: {
					value: string;
				};
				removeClass: (cssclass: string) => void;
			}
		};
	}
	interface Vault {
		setConfig: (config: string, newValue: string) => void;
		getConfig: (config: string) => string;
	}
}

export default class themeDesignUtilities extends Plugin {
	styleEl: HTMLElement;

	async onload() {

		console.log("Theme Design Utilities Plugin loaded.");
		const freezeDelaySecs = 4;
		const versionInfoNoticeDuration = 7;

		this.addCommand({
			id: "freeze-obsidian",
			name: "Freeze Obsidian (with " + freezeDelaySecs.toString() + "s delay)",
			callback: () => {
				new Notice("Will freeze Obsidian in " + freezeDelaySecs.toString() + "s \n(if the console is open.)", (freezeDelaySecs - 1) * 1000);
				setTimeout(() => { debugger }, freezeDelaySecs * 1000);
			},
		});

		this.addCommand({
			id: "test-notice",
			name: "Test Notice",
			callback: () => new Notice("I am a test notice. 👋 \n\nI will stay here until you click me.", 0),
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
			id: "color-playground",
			name: "Open GitHub Folder with Color Playground files to download",
			callback: () => window.open("https://github.com/chrisgrieser/obsidian-theme-design-utilities/tree/main/color-playground"),
		});

		this.addCommand({
			id: "toggle-dark-light-mode",
			name: "Toggle between Dark and Light Mode",
			callback: () => this.toggleDarkMode(),
		});

		this.addCommand({
			id: "cycle-views",
			name: "Cycle between Source Mode, Live Preview, and Reading Mode",
			callback: () => this.cycleViews(),
		});

		this.addCommand({
			id: "cycle-themes",
			name: "Cycle between the installed themes",
			callback: () => this.cycleThemes(),
		});

		this.addCommand({
			id: "debugging-outline",
			name: "Toggle Red Outlines for Debugging",
			callback: () => this.toggleDebuggingCSS(),
		});

		this.addCommand({
			id: "toggle-garbled-text",
			name: "Toggle Garbled Text",
			callback: () => this.toggleGarbleText(),
		});

		this.addCommand({
			id: "test-body-class",
			name: "Toggle class \".foobar\" for .app-container",
			callback: () => this.toggleTestClass(),
		});

		this.addCommand({
			id: "version-info",
			name: "CSS Feature Compatibility / Tech Stack Versions",
			callback: () => {
				const chromeVersion = (process.versions.chrome).split(".")[0];
				const nodeVersion = (process.versions.node).split(".")[0];
				const electronVersion = (process.versions.electron).split(".")[0];
				new Notice(`Chrome Version: ${chromeVersion}\nNode Version: ${nodeVersion}\nElectron Version: ${electronVersion}`, versionInfoNoticeDuration * 1000);
			}
		});
	}

	async onunload() {
		console.log("Theme Design Utilities Plugin unloaded.");
		this.app.dom.appContainerEl.removeClass("foobar");
	}

	cycleThemes() {
		const currentTheme = this.app.customCss.theme;
		const installedThemes = [
			...Object.keys(this.app.customCss.themes),
			...this.app.customCss.oldThemes
		];
		if (installedThemes.length === 0) {
			new Notice("Cannot cycle themes since no community theme is installed.");
			return;
		}

		installedThemes.push(""); // "" = default theme

		let indexOfNextTheme = installedThemes.indexOf(currentTheme) + 1;
		if (indexOfNextTheme === installedThemes.length) indexOfNextTheme = 0;

		const nextTheme = installedThemes[indexOfNextTheme];
		this.app.customCss.setTheme(nextTheme);
	}

	toggleDarkMode() {
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

		const isMarkdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!isMarkdownView) {
			new Notice("Not a regular note or no file open.");
			return;
		}

		const activePane = this.app.workspace.activeLeaf;
		const currentView = activePane.getViewState(); // won't be null since MarkdownView has been confirmed above

		let currentMode: string;
		if (currentView.state.mode === "preview") currentMode = "preview";
		if (currentView.state.mode === "source" && currentView.state.source) currentMode = "source";
		if (currentView.state.mode === "source" && !currentView.state.source) currentMode = "live";

		const newMode = currentView;
		switch (currentMode) {
			case "preview":
				newMode.state.mode = "source";
				newMode.state.source = true;
				new Notice("Now: Source Mode", noticeDuration);
				break;
			case "source":
				newMode.state.mode = "source";
				newMode.state.source = false;
				new Notice("Now: Live Preview", noticeDuration);
				break;
			case "live":
				newMode.state.mode = "preview";
				new Notice("Now: Reading Mode", noticeDuration);
				break;
		}

		activePane.setViewState(newMode);
	}

	// thanks @NothingIsLost
	toggleDebuggingCSS() {
		const currentCSS = this.styleEl?.textContent;
		let cssToApply = "";

		if (!currentCSS) {
			cssToApply = "* {outline: red 1px solid !important}";
			this.styleEl = document.createElement("style");
			this.styleEl.setAttribute("type", "text/css");
			document.head.appendChild(this.styleEl);
			this.register(() => this.styleEl.detach());
		}

		this.styleEl.textContent = cssToApply;
		this.app.workspace.trigger("css-change");
	}

	toggleGarbleText() {
		const currentCSS = this.styleEl?.textContent;
		let cssToApply = "";

		if (!currentCSS) {
			cssToApply = "body *:not(:hover) { font-family: Flow Circular !important; }";
			this.styleEl = document.createElement("style");
			this.styleEl.setAttribute("type", "text/css");
			document.head.appendChild(this.styleEl);
			this.register(() => this.styleEl.detach());
		}

		this.styleEl.textContent = cssToApply;
		this.app.workspace.trigger("css-change");
	}

	toggleTestClass() {
		const foobarActive = this.app.dom.appContainerEl.classList.value.includes("foobar");
		if (foobarActive) this.app.dom.appContainerEl.removeClass("foobar");
		else this.app.dom.appContainerEl.addClass("foobar");
	}

}
