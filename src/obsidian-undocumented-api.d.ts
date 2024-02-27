import "obsidian";

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
			};
		};
	}
	interface Vault {
		setConfig: (config: string, newValue: string) => void;
		getConfig: (config: string) => string;
	}
}
