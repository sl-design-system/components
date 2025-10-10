# Backwards Compatibility Check for CSS Variables

This script compares CSS variables between the current theme files and reference theme files to ensure backwards compatibility.

## Setup Instructions

Before running this script, you need to download the reference theme packages. Run the following commands from the parent directory of your project:

### 1. Create a directory for old themes

```bash
mkdir -p old-themes && cd old-themes
```

### 2. Download all theme packages at their 3rd most recent version (oldest of the 3 latest)

```bash
for theme in bingel-dc bingel-int clickedu editorial-suite itslearning kampus magister max my-digital-book neon sanoma-learning teas tig; do
  version=$(npm view @sl-design-system/$theme versions --json --registry=https://npm.pkg.github.com 2>/dev/null | jq -r '.[-3]' 2>/dev/null)
  if [ "$version" != "null" ] && [ -n "$version" ]; then
    echo "📦 Downloading @sl-design-system/$theme@$version..."
    npm pack @sl-design-system/$theme@$version --registry=https://npm.pkg.github.com 2>&1 | grep -E "\.tgz$"
  fi
done
```

### 3. Extract all downloaded packages and rename folders

```bash
for tgz in sl-design-system-*.tgz; do
  theme=$(echo $tgz | sed 's/sl-design-system-//' | sed 's/-[0-9].*//')
  echo "📂 Extracting $theme..."
  tar -xzf "$tgz"
  mv package "$theme"
  rm "$tgz"
done
```

## Usage

```bash
node scripts/backwards-compatibility-check.js <path-to-old-themes>
```

## Example

```bash
node scripts/backwards-compatibility-check.js ../old-themes
```

## What it does

The script will:
1. Compare CSS variables in `light.css` + `light-old.css` (and dark variants) from current themes
2. Check against the reference `light.css` (and dark variants) from the old theme packages
3. Report any CSS variables that are present in the reference but missing in the current themes
4. Ignore any new variables that only exist in current themes (not considered breaking changes)
