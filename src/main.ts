import { MarkdownView, Notice, Plugin } from "obsidian";

// https://www.electronjs.org/docs/latest/api/web-contents#contentsopendevtoolsoptions
declare const electronWindow: {
	openDevTools: () => void;
	toggleDevTools: () => void;
};
//──────────────────────────────────────────────────────────────────────────────

export default class ThemeDesignUtilities extends Plugin {
	styleEl: HTMLElement | undefined;
	freezeDelaySecs = 4; // CONFIG

	override async onload() {
		console.log("Theme Design Utilities Plugin loaded.");

		this.addCommand({
			id: "freeze-obsidian",
			name: "Freeze Obsidian (with " + this.freezeDelaySecs.toString() + "s delay)",
			callback: () => {
				this.freezeTimer(this.freezeDelaySecs);
			},
		});

		this.addCommand({
			id: "toggle-devtools",
			name: "Toggle Devtools",
			callback: () => electronWindow.toggleDevTools(), // devtools are required for the debugger to work,
		});

		this.addCommand({
			id: "test-notice",
			name: "Test Notice",
			callback: () =>
				new Notice("I am a test notice. 👋 \n\nI will stay here until you click me.", 0),
		});

		this.addCommand({
			id: "toggle-emulate-mobile",
			name: "Toggle mobile emulation",
			callback: () => this.app.emulateMobile(!this.app.isMobile),
		});

		this.addCommand({
			id: "cheatsheet-css-classes",
			name: "Cheatsheet – Obsidian CSS Classes",
			callback: () =>
				window.open(
					"https://raw.githubusercontent.com/chrisgrieser/obsidian-theme-design-utilities/master/cheatsheets/css-classes.png",
				),
		});

		this.addCommand({
			id: "color-playground",
			name: "Open GitHub Folder with Color Playground files to download",
			callback: () =>
				window.open(
					"https://github.com/chrisgrieser/obsidian-theme-design-utilities/tree/main/color-playground",
				),
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
			name: 'Toggle class ".foobar" for .app-container',
			callback: () => this.toggleTestClass(),
		});

		this.addCommand({
			id: "version-info",
			name: "CSS Feature Compatibility / Tech Stack Versions",
			callback: () => this.versionInfo(),
		});
	}

	override onunload(): void {
		console.log("Theme Design Utilities Plugin unloaded.");
		this.app.dom.appContainerEl.removeClass("foobar");
	}

	//───────────────────────────────────────────────────────────────────────────

	versionInfo(): void {
		// @ts-expect-error
		const chromeVersion = process.versions.chrome?.split(".")[0];
		const nodeVersion = process.versions.node.split(".")[0];
		// @ts-expect-error
		const electronVersion = process.versions.electron?.split(".")[0];
		const msg = [
			`Chrome Version: ${chromeVersion}`,
			`Node Version: ${nodeVersion}`,
			`Electron Version: ${electronVersion}`,
		].join("\n");
		new Notice(msg, 7 * 1000);
	}

	freezeTimer(delay: number): void {
		const freezeNotice = new Notice(`⚠ Will freeze Obsidian in ${delay}s`, (delay - 0.2) * 1000);
		electronWindow.openDevTools(); // devtools open needed for the debugger to work

		let passSecs = 0;
		const timer = setInterval(() => {
			const timePassed = (delay - passSecs).toFixed(1);
			freezeNotice.setMessage(`⚠ Will freeze Obsidian in ${timePassed}s`);
			passSecs += 0.1;
		}, 100);

		setTimeout(() => {
			// biome-ignore lint/suspicious/noDebugger: actual feature
			debugger;
			clearInterval(timer);
		}, delay * 1000);
	}

	cycleThemes(): void {
		const currentTheme = this.app.customCss.theme;
		const installedThemes = [
			...Object.keys(this.app.customCss.themes),
			...this.app.customCss.oldThemes,
		];
		if (installedThemes.length === 0) {
			new Notice("Cannot cycle themes since no community theme is installed.");
			return;
		}

		installedThemes.push(""); // "" = default theme
		const indexOfNextTheme = (installedThemes.indexOf(currentTheme) + 1) % installedThemes.length;

		const nextTheme = installedThemes[indexOfNextTheme];
		if (nextTheme === undefined) return;
		this.app.customCss.setTheme(nextTheme);
	}

	toggleDarkMode(): void {
		const isDarkMode = this.app.vault.getConfig("theme") === "obsidian";
		const lightTheme = "moonstone";
		const darkTheme = "obsidian";
		if (isDarkMode) {
			this.app.setTheme(lightTheme);
			this.app.vault.setConfig("theme", lightTheme);
			this.app.workspace.trigger("css-change");
		} else {
			this.app.setTheme(darkTheme);
			this.app.vault.setConfig("theme", darkTheme);
			this.app.workspace.trigger("css-change");
		}
	}

	cycleViews(): void {
		const noticeDuration = 2000;

		const isMarkdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!isMarkdownView) {
			new Notice("Not a regular note or no file open.");
			return;
		}

		const activePane = this.app.workspace.getLeaf();
		if (!activePane) {
			new Notice("Not a regular note or no file open.");
			return;
		}
		const currentView = activePane.getViewState();

		let currentMode: string;
		if (currentView.state.mode === "preview") currentMode = "preview";
		else if (currentView.state.mode === "source" && currentView.state.source)
			currentMode = "source";
		else currentMode = "live";

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
			default:
				newMode.state.mode = "preview";
				new Notice("Now: Reading Mode", noticeDuration);
		}

		activePane.setViewState(newMode);
	}

	// thanks to @NothingIsLost for this
	toggleDebuggingCSS(): void {
		const currentCSS = this.styleEl?.textContent;
		let cssToApply = "";

		if (!currentCSS) {
			cssToApply = "* {outline: red 1px solid !important}";
			this.styleEl = document.createElement("style");
			this.styleEl.setAttribute("type", "text/css");
			document.head.appendChild(this.styleEl);
			this.register(() => this.styleEl?.detach());
		}
		if (this.styleEl) this.styleEl.textContent = cssToApply;
		this.app.workspace.trigger("css-change");
	}

	toggleGarbleText(): void {
		const currentCSS = this.styleEl?.textContent;
		let cssToApply = "";

		if (!currentCSS) {
			cssToApply = "body *:not(:hover) { font-family: Flow Circular !important; }";
			this.styleEl = document.createElement("style");
			this.styleEl.setAttribute("type", "text/css");
			document.head.appendChild(this.styleEl);
			this.register(() => this.styleEl?.detach());
		}

		if (this.styleEl) this.styleEl.textContent = cssToApply;
		this.app.workspace.trigger("css-change");
	}

	toggleTestClass(): void {
		const foobarActive = this.app.dom.appContainerEl.classList.value.includes("foobar");
		if (foobarActive) this.app.dom.appContainerEl.removeClass("foobar");
		else this.app.dom.appContainerEl.addClass("foobar");
	}
}
