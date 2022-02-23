#!/bin/zsh

# Release Obsidian Plugin
# https://forum.obsidian.md/t/using-github-actions-to-release-plugins/7877
# https://marcus.se.net/obsidian-plugin-docs/publishing/release-your-plugin-with-github-actions

# ensure relevant files exist
if [[ ! -f "./manifest.json" ]] ; then
	echo "manifest.json does not exist yet"
	exit 1
fi
if [[ ! -f "./versions.json" ]] ; then
	echo "versions.json does not exist yet"
	exit 1
fi
if [[ ! -f "./package.json" ]] ; then
	echo "package.json does not exist yet"
	exit 1
fi
if [[ ! -f "./.github/workflows/release.yml" ]] ; then
	echo "/.github/workflows/release.yml does not exist yet"
	exit 1
fi

# Lint
cd "$(dirname "$0")" || exit
eslint --fix ./*.ts
markdownlint --fix ./*.md # disable strong style since needed for complicated table
markdown-link-check -q ./README.md

# get version number from the manifest of the latest release
lastVersion=$(grep "version" "./manifest.json" | cut -d\" -f4)
echo "last version: $lastVersion"

# Ask for new version number
echo -n "next version: "
read -r nextVersion
echo ""

# set version number in `manifest.json`
sed -E -i '' "s/\"version\".*/\"version\": \"$nextVersion\",/" "manifest.json"
sed -E -i '' "s/\"version\".*/\"version\": \"$nextVersion\",/" "package.json"

# add version number in `versions.json`, assuming same compatibility
grep -Ev "^$" "versions.json" | grep -v "}" | sed -e '$ d' > temp
minObsidianVersion=$(grep -Ev "^$" "versions.json" | grep -v "}" | tail -n1 | cut -d\" -f4)
# shellcheck disable=SC2129
echo "  \"$lastVersion\": \"$minObsidianVersion\"," >> temp
echo "  \"$nextVersion\": \"$minObsidianVersion\"" >> temp
echo "}" >> temp
mv temp versions.json

# update changelog
git log --pretty=format:"- %ad%x09%s" --date=short | grep -Ev "minor$" | grep -Ev "patch$" | grep -Ev "typos?$" | grep -v "refactoring" | grep -v "Add files via upload" | grep -Ev "\tDelete" | grep -Ev "\tUpdate.*\.md" | sed -E "s/\t\+ /\t/g" >> ./Changelog.md

# push the manifest and versions JSONs
git add -A
git commit -m "release $nextVersion"

git pull
git push

# trigger the release action
git tag "$nextVersion"
git push origin --tags
