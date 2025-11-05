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
  normalizeIndentation(text) {
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
      return line.substring(minIndent);
    }).join('\n');
  }

  /**
   * Extract stories using JSON parsing for simple objects
   */
  extractStoriesWithJSON(content) {
    const stories = [];

    // Find all story exports
    const storyExportRegex = /export\s+const\s+(\w+):\s*StoryObj\s*=\s*{([\s\S]*?)};/g;

    let match;
    while ((match = storyExportRegex.exec(content)) !== null) {
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
            description: storyObject.description || null,
            fullStory: match[0]
          });
        }
      } catch (error) {
        console.warn(`Failed to parse story ${storyName}:`, error.message);
        // Fallback to regex for this story
        stories.push(this.extractStoryWithRegex(storyName, storyObjectContent, match[0]));
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
  extractStoryWithRegex(storyName, storyContent, fullStory) {
    let template = null;
    let props = null;
    let description = null;

    // Extract template
    const templateLiteralMatch = storyContent.match(/template:\s*`([\s\S]*?)`/);
    if (templateLiteralMatch) {
      template = this.normalizeIndentation(templateLiteralMatch[1], 2);
    } else {
      const singleQuoteMatch = storyContent.match(/template:\s*'((?:[^'\\]|\\.)*)'/);
      if (singleQuoteMatch) {
        template = singleQuoteMatch[1];
      } else {
        const doubleQuoteMatch = storyContent.match(/template:\s*"((?:[^"\\]|\\.)*)"/);
        if (doubleQuoteMatch) {
          template = doubleQuoteMatch[1];
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
      description,
      fullStory
    };
  }

  /**
   * Parse a TypeScript story file and extract component information
   */
  parseStoryFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.stories.ts');

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
        template = this.normalizeIndentation(templateLiteralMatch[1], 2);
      } else {
        // Try single quotes
        const singleQuoteMatch = componentBlock.match(/template:\s*'((?:[^'\\]|\\.)*)'/);
        if (singleQuoteMatch) {
          template = singleQuoteMatch[1];
        } else {
          // Try double quotes
          const doubleQuoteMatch = componentBlock.match(/template:\s*"((?:[^"\\]|\\.)*)"/);
          if (doubleQuoteMatch) {
            template = doubleQuoteMatch[1];
          }
        }
      }

      // Extract selector
      const selectorMatch = componentBlock.match(/selector:\s*['"`]([^'"`]+)['"`]/);
      const selector = selectorMatch ? selectorMatch[1] : null;

      // Extract class content (properties and methods)
      const classMatch = componentBlock.match(/export\s+class\s+\w+\s*{([\s\S]*?)}\s*$/);
      const classContent = classMatch ? this.normalizeIndentation(classMatch[1], 4) : null;

      if (template && selector) {
        components.push({
          name: componentName,
          selector,
          template: template.trim(),
          classContent,
          fullComponent: componentBlock
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
      originalContent: content
    };
  }

  /**
   * Generate MDX content from parsed story data
   */
  generateMDX(storyData) {
    const { title, components, stories, fileName } = storyData;

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
@Component({
  selector: '${component.selector}',
  template: \`${component.template}\`
})
export class ${component.name} {
${component.classContent || '  // Component logic here'}
}
\`\`\`

`;
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
   * Process all story files in the Angular stories directory
   */
  processAllStories() {
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

    storyFiles.forEach(file => {
      const filePath = path.join(this.angularStoriesPath, file);
      const storyData = this.parseStoryFile(filePath);

      if (storyData.components.length > 0 || storyData.stories.length > 0) {
        const mdxContent = this.generateMDX(storyData);
        const outputFile = path.join(this.outputPath, `${storyData.fileName}.mdx`);

        fs.writeFileSync(outputFile, mdxContent);
        console.log(`✅ Generated: ${storyData.fileName}.mdx`);
      } else {
        console.log(`⚠️  Skipped ${file}: No components or stories found`);
      }
    });

    console.log('\n🎉 Template extraction complete!');
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
          const storyData = this.parseStoryFile(filePath);
          const mdxContent = this.generateMDX(storyData);
          const outputFile = path.join(this.outputPath, `${storyData.fileName}.mdx`);

          fs.writeFileSync(outputFile, mdxContent);
          console.log(`✅ Regenerated: ${outputFile}`);
        }
      }
    });
  }
}

// CLI interface
const args = process.argv.slice(2);
const extractor = new StoryTemplateExtractor();

if (args.includes('--watch')) {
  extractor.processAllStories();
  extractor.watch();
} else {
  extractor.processAllStories();
}
