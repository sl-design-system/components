## Tokens

## Exports

In the v2 config, an output with format: `css` is a self-contained inline definition.

To reuse the saved export from your branch, reference it with use:

```
"sources": {
  "core": {
    "project": "<project-id>",
    "ref": {
      "type": "branch",
      "name": "main"
    }
  },
},
"outputs": {
  "core": {
    "format": "raw",
    "source": "core",
    "dir": "./export/core"
  },
  "core-css": {
    "source": "core",
    "use": { "id": "<export-config-uuid>", "name": "core-css" },
    "dir": "./export/core-css"
  }
}
```

You can get the uuid with:

`studio exports list --alias core`

The --alias flag on exports run picks the source, not the export

`--alias core-css` points at your sources map, which only contains core, so that command should have exited with an error (easy to miss after the studio pull output in a && chain), and ./export/tokens was likely never written. The correct call is:

`studio exports run core-css --alias core --out ./export/tokens`

This resolves the saved export on your branch and applies its prefix and strategy correctly.
