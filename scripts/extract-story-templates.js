#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract story templates and generate MDX documentation
 */
class StoryTemplateExtractor {
  constructor() {
    this.angularStoriesPath = path.join(__dirname, '../packages/angular/stories');
    this.outputPath = path.join(__dirname, '../packages/angular/stories/generated');
  }

  /**
   * Normalize indentation by removing common leading whitespace
   */
  normalizeIndentation(text, baseIndent = 0) {
    if (!text) return text;

    const lines = text.split('\n');

    // Filter out empty lines for indentation calculation
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return text;

    // Find the minimum indentation (excluding the first line if it starts at column 0)
    let minIndent = Infinity;
    for (let i = 0; i < nonEmptyLines.length; i++) {
      const line = nonEmptyLines[i];
      const leadingWhitespace = line.match(/^(\s*)/)[1].length;

      // Skip the first line if it has no indentation (starts at column 0)
      if (i === 0 && leadingWhitespace === 0) continue;

      minIndent = Math.min(minIndent, leadingWhitespace);
    }

    // If no indentation found, return as-is
    if (minIndent === Infinity || minIndent === 0) return text;

    // Remove the common indentation from all lines
    return lines.map(line => {
      if (line.trim().length === 0) return ''; // Keep empty lines empty
      return line.substring(Math.max(minIndent - baseIndent, 0));
    }).join('\n');
  }

  /**
   * Extract stories using JSON parsing for simple objects
   */
  extractStoriesWithJSON(content) {
    const stories = [];

    // Pattern 1: StoryObj format - export const Name: StoryObj = { ... }
    const storyObjRegex = /export\s+const\s+(\w+):\s*StoryObj\s*=\s*{([\s\S]*?)};/g;

    let match;
    while ((match = storyObjRegex.exec(content)) !== null) {
      const storyName = match[1];
      const storyObjectContent = match[2];

      try {
        // Extract the render function content
        const renderMatch = storyObjectContent.match(/render:\s*\(\)\s*=>\s*\(([\s\S]*?)\)/);
        if (renderMatch) {
          const renderObjectContent = renderMatch[1].trim();

          // Try to parse as JSON
          const storyObject = this.parseStoryObjectAsJSON(renderObjectContent);

          stories.push({
            name: storyName,
            template: storyObject.template || null,
            props: storyObject.props || null,
            description: storyObject.description || null
          });
        }
      } catch (error) {
        // Try regex fallback for this story
        const regexResult = this.extractStoryWithRegex(storyName, storyObjectContent);

        // Only warn if regex also failed to extract a template
        if (!regexResult.template) {
          console.warn(`Failed to parse story ${storyName}: No template found with JSON or regex parsing`);
        }

        stories.push(regexResult);
      }
    }

    // Pattern 2: StoryFn format - export const Name: StoryFn = () => ({ ... })
    const storyFnRegex = /export\s+const\s+(\w+):\s*StoryFn\s*=\s*\(\)\s*=>\s*\({([\s\S]*?)}\);/g;

    while ((match = storyFnRegex.exec(content)) !== null) {
      const storyName = match[1];
      const storyObjectContent = match[2];

      try {
        // Try to parse as JSON
        const storyObject = this.parseStoryObjectAsJSON(storyObjectContent);
        stories.push({
          name: storyName,
          template: storyObject.template || null,
          props: storyObject.props || null,
          description: storyObject.description || null
        });
      } catch (error) {
        // Try regex fallback for this story
        const regexResult = this.extractStoryWithRegex(storyName, storyObjectContent);

        // Only warn if regex also failed to extract a template
        if (!regexResult.template) {
          console.warn(`Failed to parse story ${storyName}: No template found with JSON or regex parsing`);
        }

        stories.push(regexResult);
      }
    }

    return stories;
  }

  /**
   * Parse story object content as JSON
   */
  parseStoryObjectAsJSON(objectContent) {
    try {
      // For simple string properties, we can convert to JSON format
      // Replace single quotes with double quotes for JSON compatibility
      let jsonContent = objectContent
        .replace(/'/g, '"')  // Convert single quotes to double quotes
        .replace(/(\w+):/g, '"$1":');  // Add quotes around property names

      // Wrap in braces to make it a valid JSON object
      const wrappedContent = `{${jsonContent}}`;

      return JSON.parse(wrappedContent);
    } catch (error) {
      throw new Error(`Could not parse as JSON: ${error.message}`);
    }
  }

  /**
   * Fallback regex parsing for stories that can't be parsed as JSON
   */
  extractStoryWithRegex(storyName, storyContent) {
    let template = null;
    let props = null;
    let description = null;

    // Extract template
    const templateLiteralMatch = storyContent.match(/template:\s*`([\s\S]*?)`/);
    if (templateLiteralMatch) {
      template = this.normalizeIndentation(templateLiteralMatch[1], 2).trim();
    } else {
      const singleQuoteMatch = storyContent.match(/template:\s*'((?:[^'\\]|\\.)*)'/);
      if (singleQuoteMatch) {
        template = singleQuoteMatch[1].trim();
      } else {
        const doubleQuoteMatch = storyContent.match(/template:\s*"((?:[^"\\]|\\.)*)"/);
        if (doubleQuoteMatch) {
          template = doubleQuoteMatch[1].trim();
        }
      }
    }

    // Extract props
    const propsMatch = storyContent.match(/props:\s*{([\s\S]*?)},?\s*template:/);
    if (propsMatch) {
      props = this.normalizeIndentation(propsMatch[1], 2);
    }

    // Extract description
    let descriptionMatch = storyContent.match(/description:\s*{\s*story:\s*['"`]([\s\S]*?)['"`]/);
    if (descriptionMatch) {
      description = descriptionMatch[1].trim();
    } else {
      descriptionMatch = storyContent.match(/description:\s*['"`]([\s\S]*?)['"`]/);
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      }
    }

    return {
      name: storyName,
      template,
      props,
      description
    };
  }

  /**
   * Extract import statements from the file
   */
  extractImports(content) {
    const importRegex = /^import\s+(?:{[^}]+}|[^;]+)\s+from\s+['"]([^'"]+)['"];?$/gm;
    const imports = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      let importLine = match[0].trim();
      const source = match[1];

      // Skip Angular core and Storybook imports
      if (source.startsWith('@angular/') || source.includes('storybook')) {
        continue;
      }

      // Ensure semicolon at the end
      if (!importLine.endsWith(';')) {
        importLine += ';';
      }

      imports.push(importLine);
    }

    return imports.join('\n');
  }

  /**
   * Parse a TypeScript story file and extract component information
   */
  parseStoryFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.stories.ts');

    // Extract file-level imports
    const fileImports = this.extractImports(content);

    // Extract component definitions using regex (still needed for @Component classes)
    const componentRegex = /@Component\s*\(\s*{[\s\S]*?}\s*\)\s*export\s+class\s+(\w+)[\s\S]*?(?=@Component|export\s+default|$)/g;
    const components = [];

    let match;
    while ((match = componentRegex.exec(content)) !== null) {
      const componentBlock = match[0];
      const componentName = match[1];

      // Extract template - handle backticks, single quotes, and double quotes
      let template = null;

      // Try backticks first (for multi-line templates)
      const templateLiteralMatch = componentBlock.match(/template:\s*`([\s\S]*?)`/);
      if (templateLiteralMatch) {
        template = this.normalizeIndentation(templateLiteralMatch[1], 2).trim();
      } else {
        // Try single quotes
        const singleQuoteMatch = componentBlock.match(/template:\s*'((?:[^'\\]|\\.)*)'/);
        if (singleQuoteMatch) {
          template = singleQuoteMatch[1].trim();
        } else {
          // Try double quotes
          const doubleQuoteMatch = componentBlock.match(/template:\s*"((?:[^"\\]|\\.)*)"/);
          if (doubleQuoteMatch) {
            template = doubleQuoteMatch[1].trim();
          }
        }
      }

      // Extract imports
      let imports = null;
      const importsLiteralMatch = componentBlock.match(/imports:\s*\[([\s\S]*?)\]/);
      if (importsLiteralMatch) {
        imports = this.normalizeIndentation(importsLiteralMatch[1], 4);
      }

      // Extract selector
      const selectorMatch = componentBlock.match(/selector:\s*['"`]([^'"`]+)['"`]/);
      const selector = selectorMatch ? selectorMatch[1] : null;

      // Extract class content (properties and methods)
      const classMatch = componentBlock.match(/export\s+class\s+\w+\s*{([\s\S]*?)}\s*$/);
      const classContent = classMatch ? this.normalizeIndentation(classMatch[1], 4) : null;

      // Include component even if it doesn't have a selector (e.g., dialog content components)
      if (template) {
        components.push({
          name: componentName,
          selector: selector || null,
          template,
          imports,
          classContent
        });
      }
    }

    // Extract stories using JSON parsing (more reliable than regex for simple objects)
    const stories = this.extractStoriesWithJSON(content);

    // Extract meta information
    const metaMatch = content.match(/export\s+default\s+{([\s\S]*?)}\s+as\s+Meta/);
    let title = fileName; // Default fallback

    if (metaMatch) {
      const metaContent = metaMatch[1];
      const titleMatch = metaContent.match(/title:\s*['"`]([^'"`]+)['"`]/);
      if (titleMatch) {
        title = titleMatch[1];
      }
    }

    return {
      fileName,
      title,
      components,
      stories,
      fileImports
    };
  }

  /**
   * Generate MDX content from parsed story data
   */
  generateMDX(storyData) {
    const { title, components, stories, fileName, fileImports } = storyData;

    // Check for custom introduction file
    const introFile = path.join(this.angularStoriesPath, `${fileName}.intro.md`);
    let customIntro = '';

    if (fs.existsSync(introFile)) {
      customIntro = fs.readFileSync(introFile, 'utf-8').trim();
    }

    let mdx = `import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="${title}" />

# ${title}

{/*
This file is automatically generated from ${storyData.fileName}.stories.ts
Do not edit this file directly. Run 'yarn extract-templates' to regenerate.
To add custom introduction content, create ${fileName}.intro.md */}

`;

    // Add custom introduction if available
    if (customIntro) {
      mdx += `${customIntro}

`;
    }

    // Add stories documentation
    stories.forEach((story, index) => {
      const component = components.find(c => story.template && story.template.includes(c.selector));

      mdx += `## ${story.name.replace(/([A-Z])/g, ' $1').trim()}

`;

      if (story.description) {
        mdx += `${story.description}

`;
      }

      if (component) {
        mdx += `
\`\`\`typescript
${fileImports ? fileImports + '\n\n' : ''}@Component({
  selector: '${component.selector}',
  template: \`${component.template}\`${component.imports ? `,
  imports: [${component.imports}]` : ''}
})
export class ${component.name} {
${component.classContent || '  // Component logic here'}
}
\`\`\`

`;

        // Find and include any additional components referenced in this component's code
        if (component.classContent) {
          // Look for component references in generic type parameters like <CustomMessageComponent, string>
          const referencedComponentRegex = /<(\w+Component),/g;

          let refMatch;

          const referencedComponents = new Set();

          while ((refMatch = referencedComponentRegex.exec(component.classContent)) !== null) {
            const refComponentName = refMatch[1];

            // Find this component in our extracted components
            const refComponent = components.find(c => c.name === refComponentName);
            if (refComponent && refComponent.name !== component.name) {
              referencedComponents.add(refComponent);
            }
          }

          // Add any referenced components to the documentation
          if (referencedComponents.size > 0) {
            mdx += `**Referenced Components:**

The examples above use the following custom component(s):

`;
            referencedComponents.forEach(refComp => {
              mdx += `
\`\`\`typescript
@Component({${refComp.selector ? `
  selector: '${refComp.selector}',` : ''}
  standalone: true,${refComp.imports ? `
  imports: [${refComp.imports}],` : ''}
  template: \`${refComp.template}\`
})
export class ${refComp.name} {
${refComp.classContent || '  // Component logic here'}
}
\`\`\`

`;
            });
          }
        }
      } else if (story.template) {
        mdx += `### Template

\`\`\`html
${story.template}
\`\`\`
${story.props ? `
### Props

\`\`\`typescript
${story.props}
\`\`\`
` : ''}

`;
      }
    });
    return mdx;
  }

  /**
   * Check if source file is newer than output file
   */
  isSourceNewer(sourceFile, outputFile) {
    if (!fs.existsSync(outputFile)) {
      return true; // Output doesn't exist, need to generate
    }

    const sourceStats = fs.statSync(sourceFile);
    const outputStats = fs.statSync(outputFile);

    return sourceStats.mtime > outputStats.mtime;
  }

  /**
   * Process a single story file
   */
  processSingleStory(file, forceRegenerate = false) {
    const filePath = path.join(this.angularStoriesPath, file);
    const fileName = path.basename(file, '.stories.ts');
    const outputFile = path.join(this.outputPath, `${fileName}.mdx`);

    // Check if regeneration is needed
    if (!forceRegenerate && !this.isSourceNewer(filePath, outputFile)) {
      return { skipped: true, reason: 'up-to-date' };
    }

    const storyData = this.parseStoryFile(filePath);

    if (storyData.components.length > 0 || storyData.stories.length > 0) {
      const mdxContent = this.generateMDX(storyData);
      fs.writeFileSync(outputFile, mdxContent);
      return { success: true, outputFile: `${fileName}.mdx` };
    } else {
      return { skipped: true, reason: 'no-content' };
    }
  }

  /**
   * Process all story files in the Angular stories directory
   */
  processAllStories(forceRegenerate = false) {
    const startTime = Date.now();

    if (!fs.existsSync(this.angularStoriesPath)) {
      console.error(`Stories directory not found: ${this.angularStoriesPath}`);
      return;
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }

    const storyFiles = fs.readdirSync(this.angularStoriesPath)
      .filter(file => file.endsWith('.stories.ts'));

    console.log(`Found ${storyFiles.length} story files to process...`);

    let processed = 0;
    let skipped = 0;
    let upToDate = 0;

    storyFiles.forEach(file => {
      const result = this.processSingleStory(file, forceRegenerate);

      if (result.success) {
        console.log(`✅ Generated: ${result.outputFile}`);
        processed++;
      } else if (result.reason === 'up-to-date') {
        console.log(`⏭️  Skipped: ${file} (up-to-date)`);
        upToDate++;
      } else {
        console.log(`⚠️  Skipped: ${file} (${result.reason})`);
        skipped++;
      }
    });

    const duration = Date.now() - startTime;
    console.log(`\n🎉 Template extraction complete! (${duration}ms)`);
    console.log(`📊 Processed: ${processed}, Up-to-date: ${upToDate}, Skipped: ${skipped}`);
    console.log(`📁 Generated files are in: ${this.outputPath}`);
  }

  /**
   * Watch for changes and regenerate
   */
  watch() {
    console.log(`👀 Watching ${this.angularStoriesPath} for changes...`);

    fs.watch(this.angularStoriesPath, { recursive: false }, (eventType, filename) => {
      if (filename && filename.endsWith('.stories.ts')) {
        console.log(`📝 ${filename} changed, regenerating...`);
        const filePath = path.join(this.angularStoriesPath, filename);

        if (fs.existsSync(filePath)) {
          const result = this.processSingleStory(filename, true); // Force regenerate for changed files

          if (result.success) {
            console.log(`✅ Regenerated: ${result.outputFile}`);
          } else {
            console.log(`⚠️  Failed to regenerate ${filename}: ${result.reason}`);
          }
        }
      }
    });
  }

  /**
   * Process specific files (for CLI usage)
   */
  processSpecificFiles(filePatterns) {
    const storyFiles = fs.readdirSync(this.angularStoriesPath)
      .filter(file => file.endsWith('.stories.ts'))
      .filter(file => {
        return filePatterns.some(pattern => {
          return file.includes(pattern) || file === pattern;
        });
      });

    if (storyFiles.length === 0) {
      console.log(`No matching files found for patterns: ${filePatterns.join(', ')}`);
      return;
    }

    console.log(`Processing ${storyFiles.length} matching files...`);

    storyFiles.forEach(file => {
      const result = this.processSingleStory(file, true);

      if (result.success) {
        console.log(`✅ Generated: ${result.outputFile}`);
      } else {
        console.log(`⚠️  Skipped: ${file} (${result.reason})`);
      }
    });
  }
}

// CLI interface
const args = process.argv.slice(2);
const extractor = new StoryTemplateExtractor();

// Parse command line arguments
const hasWatch = args.includes('--watch');
const hasForce = args.includes('--force');
const hasHelp = args.includes('--help') || args.includes('-h');

// Extract file patterns (arguments that don't start with --)
const filePatterns = args.filter(arg => !arg.startsWith('--'));

if (hasHelp) {
  console.log(`
📚 Story Template Extractor

Usage:
  node extract-story-templates.js [options] [file-patterns]

Options:
  --watch         Watch for changes and regenerate automatically
  --force         Force regeneration of all files (ignore timestamps)
  --help, -h      Show this help message

Examples:
  node extract-story-templates.js                    # Process all files (incremental)
  node extract-story-templates.js --force            # Force regenerate all files
  node extract-story-templates.js --watch            # Watch mode
  node extract-story-templates.js wrappers-form      # Process only wrappers-form.stories.ts
  node extract-story-templates.js accordion tooltip  # Process specific files
`);
  process.exit(0);
}

if (filePatterns.length > 0) {
  // Process specific files
  extractor.processSpecificFiles(filePatterns);
} else if (hasWatch) {
  // Watch mode: process all files once, then watch
  extractor.processAllStories(hasForce);
  extractor.watch();
} else {
  // Normal mode: process all files
  extractor.processAllStories(hasForce);
}
