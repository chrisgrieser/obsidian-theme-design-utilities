# Theme Design Utilities

![](https://img.shields.io/github/downloads/chrisgrieser/obsidian-theme-design-utilities/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/obsidian-theme-design-utilities?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md)

Some utilities and Quality-of-Life features for designers of [Obsidian](https://en.wikipedia.org/wiki/Obsidian) themes.

## Table of Content
<!-- MarkdownTOC -->

- [Features](#features)
	- [Mobile Emulation](#mobile-emulation)
	- [Freeze Obsidian](#freeze-obsidian)
	- [Permanent Test Notice](#permanent-test-notice)
	- [Cheatsheets](#cheatsheets)
- [Other Resources for Obsidian Theme Designers](#other-resources-for-obsidian-theme-designers)
	- [Obsidian Plugins](#obsidian-plugins)
	- [Guides](#guides)
- [Installation](#installation)
- [Contribute](#contribute)
- [Credits](#credits)

<!-- /MarkdownTOC -->

## Features

### Mobile Emulation
Conveniently enable the mobile emulation of Obsidian, i.e. how Obsidian would look on mobile. This helps with styling your theme for mobile.[^1]

### Freeze Obsidian
Freeze interaction with Obsidian, after a small delay. During that delay, you can create fleeting elements like context menus or tooltips which will stay on screen. (Note that this only works while the console is open.) To unfreeze Obsidian, simply click the "play" button which appeared at the top of Obsidian.

<img src="https://user-images.githubusercontent.com/73286100/144731519-2f64352e-5264-45c3-bb3c-eb05c56a8322.png" alt="image" width=25%>

### Permanent Test Notice
Post a notice (notification) that stays on screen until you click it. This is useful for styling notices, as they normally quickly fade away.

<img width=40% alt="Test Notice" src="https://user-images.githubusercontent.com/73286100/144614112-de2e3bc2-d8f0-4c0f-b770-3718a8c6ce33.png">

### Cheatsheets
Directly open a cheat sheet showing the Obsidian CSS classes.[^2]

<img src="./cheatsheets/css-classes.png" alt="Obsidian API Model" width=40%>

## Other Resources for Obsidian Theme Designers

### Obsidian Plugins
- [My Snippets](https://github.com/chetachiezikeuzor/MySnippets-Plugin)
- [Snippet Commands](https://github.com/deathau/snippet-commands-obsidian)
- [BRAT](https://github.com/TfTHacker/obsidian42-brat#themes)
- [Theme Picker](https://github.com/kenset/obsidian-theme-picker)
- [Garble Text](https://github.com/kurakart/garble-text)

### Guides
- [Overview of Resources and Guides for Theme Designers](https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/Resources+and+Guides+for+Theme+Designers)
- [Why and How to use Stylelint for your Obsidian Theme](https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/Why+and+How+to+use+Stylelint+for+your+Obsidian+Theme)
- [Want some Sass with your obsidian theme? Here's How and Why](https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/Want+some+Sass+with+your+obsidian+theme%E2%80%BD+here's+How+and+Why)

## Installation
This plugin is available in Obsidian's Community Plugin Browser: `Settings` → `Community Plugins` → `Browse` → Search for *"Theme Design Utilities"*

## Contribute
Pull Requests adding more utilities are very welcome!

Please use the `.eslintrc` configuration located in the repository and run eslint before doing a pull request, though. 🙂

```shell
# install eslint
npm install eslint

# Run eslint fixing most common mistakes
eslint --fix *.ts

# Then, fix the errors that cannot be auto-fixed.
```

## Credits
Donations via [PayPal](https://www.paypal.com/paypalme/ChrisGrieser) or [Ko-Fi](https://ko-fi.com/pseudometa) 🙏

In my day job, I am a researcher and sociology. In my phD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to visit [my academic homepage](https://chris-grieser.de/) and get in touch!

- [Discord](https://discord.gg/veuWUTm): `@pseudometa#9546`
- Twitter: [@pseudo_meta](https://twitter.com/pseudo_meta)

[^1]: Basically, this plugin adds a command that toggles `app.emulateMobile`.
[^2]: made by @TfThacker (thanks!)
