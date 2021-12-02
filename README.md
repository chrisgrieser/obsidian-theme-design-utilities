# Theme Design Utilities

<!-- ![](https://img.shields.io/github/downloads/chrisgrieser/obsidian-theme-design-utilities/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/obsidian-theme-design-utilities?label=Latest%20Release&style=plastic) -->

Small set of utilities and Quality-of-Life features for designers of [Obsidian](https://en.wikipedia.org/wiki/Obsidian) themes.

## Table of Content
<!-- MarkdownTOC -->

- [Features](#features)
	- [Mobile Emulation](#mobile-emulation)
	- [Permanent Notice](#permanent-notice)
- [Other Resources for Obsidian Theme Designers](#other-resources-for-obsidian-theme-designers)
- [Installation](#installation)
- [Contribute](#contribute)
- [Credits](#credits)

<!-- /MarkdownTOC -->

## Features

### Mobile Emulation
Conveniently toggle emulation of the mobile version of Obsidian. This helps with styling your theme for mobile. (Basically, this plugin adds commands that run `app.emulateMobile(true);` and `app.emulateMobile(false);`)

### Permanent Notice
Post a notice (notification) that stays on screen until you click it. This is useful for styling notices, as they normally quickly fade away.

## Other Resources for Obsidian Theme Designers
If you are looking for tools to help out designing a theme with Obsidian, you also might be interested in the following plugins:
- [My Snippets](https://github.com/chetachiezikeuzor/MySnippets-Plugin)
- [Snippet Commands](https://github.com/deathau/snippet-commands-obsidian)
- [Theme Picker](https://github.com/kenset/obsidian-theme-picker)

If you haven't, you should also check out this overview of resources for designing an Obsidian Theme.
- [Resources and Guides for Theme Designers - Obsidian Hub](https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/Resources+and+Guides+for+Theme+Designers)

## Installation
Right now, the plugin is still in beta. It can be installed with the [BRAT Plugin](https://github.com/TfTHacker/obsidian42-brat).

This plugin will be available in Obsidian's Community Plugin Browser: `Settings` → `Community Plugins` → `Browse` → Search for *"Theme Design Utilities"*

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
