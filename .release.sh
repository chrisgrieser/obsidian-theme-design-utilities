#!/bin/zsh

# Release Obsidian Plugin
# https://forum.obsidian.md/t/using-github-actions-to-release-plugins/7877
# https://marcus.se.net/obsidian-plugin-docs/publishing/release-your-plugin-with-github-actions

# ensure relevant files exist
if [[ ! -f "./manifest.json" ]] ; then
	echo "manifest.json does not exist yet"
	return
fi
if [[ ! -f "./versions.json" ]] ; then
	echo "versions.json does not exist yet"
	return
fi
if [[ ! -f "./.github/workflows/release.yml" ]] ; then
	echo "/.github/workflows/release.yml does not exist yet"
	return
fi

# Lint
eslint --fix *.ts

# get version number from the manifest of the latest release
lastVersion=$(cat "./manifest.json" | grep "version" | cut -d\" -f4)
echo "last version: $lastVersion"

# Ask for new version number
echo -n "next version: "
read nextVersion
echo ""

# set version number in `manifest.json`
sed -E -i '' "s/\"version\".*/\"version\": \"$nextVersion\",/" "manifest.json"

# add version number in `versions.json`, assuming same compatibility
cat "versions.json" | egrep -v "^$" | grep -v "}" | sed -e '$ d' > temp
minObsidianVersion=$(cat "versions.json" | egrep -v "^$" | grep -v "}" | tail -n1 | cut -d\" -f4)
echo "  \"$lastVersion\": \"$minObsidianVersion\"," >> temp
echo "  \"$nextVersion\": \"$minObsidianVersion\"" >> temp
echo "}" >> temp
mv temp versions.json

# update changelog
git log --pretty=format:"- %ad%x09%s" --date=short | egrep "\t\+|\trelease \d" > ./Changelog.md

# push the manifest and versions JSONs
git add -A
git commit -m "release $nextVersion"
git push

# trigger the release action
git tag "$nextVersion"
git push origin --tags
