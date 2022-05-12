#!/bin/zsh

# Release Obsidian Plugin
# https://forum.obsidian.md/t/using-github-actions-to-release-plugins/7877
# https://marcus.se.net/obsidian-plugin-docs/publishing/release-your-plugin-with-github-actions

# Requirements
# - markdownlint
# - eslint

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

# Prompt for version number, if not entered
nextVersion="$*"
currentVersion=$(grep "version" "./manifest.json" | cut -d\" -f4)
echo "current version: $currentVersion"
echo -n "   next version: "
if [[ -z "$nextVersion" ]]; then
	read -r nextVersion
else
	echo "$nextVersion"
fi
echo ""

# Lint
cd "$(dirname "$0")" || exit 1
eslint . --fix --ext=ts # to not lint the main.js files
markdownlint --fix ./README.md

# set version number in `manifest.json`
sed -E -i '' "s/\"version\".*/\"version\": \"$nextVersion\",/" "manifest.json"
sed -E -i '' "s/\"version\".*/\"version\": \"$nextVersion\",/" "package.json"

# add version number in `versions.json`, assuming same compatibility
grep -Ev "^$" "versions.json" | grep -v "}" | sed -e '$ d' > temp
minObsidianVersion=$(grep -Ev "^$" "versions.json" | grep -v "}" | tail -n1 | cut -d\" -f4)
# shellcheck disable=SC2129
echo "  \"$currentVersion\": \"$minObsidianVersion\"," >> temp
echo "  \"$nextVersion\": \"$minObsidianVersion\"" >> temp
echo "}" >> temp
mv temp versions.json

# update changelog
echo "- $(date +"%Y-%m-%d")	release $nextVersion" > ./Changelog.md
git log --pretty=format:"- %ad%x09%s" --date=short | grep -Ev "minor$" | grep -Ev "patch$" | grep -Ev "typos?$" | grep -v "refactoring" | grep -v "Add files via upload" | grep -Ev "\tDelete" | grep -Ev "\tUpdate.*\.md" | sed -E "s/\t\+ /\t/g" >> ./Changelog.md

# push the manifest and versions JSONs
git add -A
git commit -m "release $nextVersion"

git pull
git push

# trigger the release action
git tag "$nextVersion"
git push origin --tags
