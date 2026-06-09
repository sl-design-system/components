# Story Template Extractor

This script automatically extracts templates and component code from Angular story files and generates comprehensive MDX documentation.

## Features

- 🔄 **Automatic extraction** of templates from `@Component` decorators in story files
- 📝 **MDX generation** with proper formatting and code blocks
- 🔍 **Component analysis** - extracts selectors, templates, and class content
- 👀 **Watch mode** for automatic regeneration on file changes
- 📚 **Story documentation** - includes usage examples
- ✍️ **Custom introductions** - add personalized content via `.intro.md` files

## Usage

### Generate documentation once

```bash
yarn extract-templates
```

### Watch for changes and auto-regenerate

```bash
yarn extract-templates:watch
```

## What it does

1. **Scans** all `*.stories.ts` files in the Angular stories directory
2. **Extracts** component definitions, templates, and story configurations
3. **Looks for** companion `*.intro.md` files for custom introduction content
4. **Generates** corresponding `*.generated.mdx` files with:
   - Custom introduction content (if `*.intro.md` exists) or sensible defaults
   - Component information (selector, class name)
   - Template code with syntax highlighting
   - TypeScript component code
   - Usage examples from stories
   - Automatic cross-references

## Output

Generated files are placed in `packages/angular/stories/generated/` with the naming convention:

- `{storyname}.generated.mdx`

Example: `accordion.stories.ts` → `accordion.generated.mdx`

## File Structure

```
packages/angular/stories/
├── accordion.stories.ts          # Source story file
├── accordion.intro.md            # Custom introduction content (optional)
├── accordion.mdx                 # Manual documentation (optional)
└── generated/
    └── accordion.generated.mdx   # Auto-generated documentation
```

## Integration with Storybook

The generated MDX files are automatically included in Storybook via the configuration in `.storybook/main.ts`:

```typescript
stories: [
  '../stories/*.mdx', // Manual docs
  '../stories/generated/*.generated.mdx', // Auto-generated docs
  '../stories/*.stories.ts' // Stories
];
```

## Benefits

- ✅ **Single source of truth** - templates are extracted directly from story files
- ✅ **Always up-to-date** - documentation reflects actual code
- ✅ **No duplication** - eliminates manual copy-paste errors
- ✅ **Consistent formatting** - standardized documentation structure
- ✅ **Developer friendly** - clear separation of manual vs generated docs

## Development Workflow

1. **Write your stories** in `*.stories.ts` files with `@Component` decorators
2. **Create custom introductions** (optional) in `*.intro.md` files
3. **Run the extractor** with `yarn extract-templates`
4. **Review generated docs** in the `generated/` folder
5. **Customize as needed** by adding manual `*.mdx` files for additional content
6. **Add to CI/CD** to regenerate docs automatically

### Adding Custom Introductions

To add custom introduction content to your generated documentation:

1. **Create an introduction file** named `{component}.intro.md` next to your story file:

   ```
   packages/angular/stories/
   ├── accordion.stories.ts
   └── accordion.intro.md    # ← Custom introduction
   ```

2. **Write your introduction** in Markdown format:

   ```markdown
   An Accordion is a collapsible content panel...

   ## Key Features

   - Feature 1
   - Feature 2

   ## When to Use

   Use accordions when...
   ```

3. **Regenerate** documentation with `yarn extract-templates`

The custom introduction will be inserted after the title and before the component information section.

## File Naming Convention

- **Source files**: `{component}.stories.ts`
- **Generated files**: `{component}.generated.mdx`
- **Manual files**: `{component}.mdx`

## Supported Patterns

The extractor recognizes these patterns in story files:

### Component Definition

```typescript
@Component({
  selector: 'app-example',
  template: `<div>Template content</div>`
})
export class ExampleComponent {
  // Class content
}
```

### Story Definition

```typescript
export const ExampleStory: StoryObj = {
  render: () => ({
    template: '<app-example></app-example>'
  })
};
```

## Configuration

The script can be configured by modifying `scripts/docs/extract-story-templates.js`:

- `angularStoriesPath` - Source directory for story files
- `outputPath` - Destination for generated MDX files
- Template parsing patterns and output formatting

## Troubleshooting

### No files generated

- Check that story files exist in `packages/angular/stories/`
- Ensure story files contain `@Component` decorators
- Verify file permissions for the output directory

### Malformed output

- Check that component templates use backticks (template literals)
- Ensure proper TypeScript syntax in story files
- Review the parsing regex patterns in the script

### Storybook doesn't show generated docs

- Verify `.storybook/main.ts` includes the generated files pattern
- Check that files are actually generated in the expected location
- Restart Storybook after configuration changes
