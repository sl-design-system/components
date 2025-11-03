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
  normalizeIndentation(text, extraIndentation = 0) {
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
      return line.substring(minIndent-extraIndentation);
    }).join('\n');
  }

  /**
   * Parse a TypeScript story file and extract component information
   */
  parseStoryFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.stories.ts');

    // Extract component definitions
    const componentRegex = /@Component\s*\(\s*{[\s\S]*?}\s*\)\s*export\s+class\s+(\w+)[\s\S]*?(?=@Component|export\s+default|$)/g;
    const components = [];

    let match;
    while ((match = componentRegex.exec(content)) !== null) {
      const componentBlock = match[0];
      const componentName = match[1];

      // Extract template
      const templateMatch = componentBlock.match(/template:\s*`([\s\S]*?)`/);
      const template = templateMatch ? this.normalizeIndentation(templateMatch[1],2) : null;

      // Extract selector
      const selectorMatch = componentBlock.match(/selector:\s*['"`]([^'"`]+)['"`]/);
      const selector = selectorMatch ? selectorMatch[1] : null;

      // Extract class content (properties and methods)
      const classMatch = componentBlock.match(/export\s+class\s+\w+\s*{([\s\S]*?)}\s*$/);
      const classContent = classMatch ? this.normalizeIndentation(classMatch[1],2) : null;

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

    // Extract stories - handle both StoryObj and StoryFn
    const storyObjRegex = /export\s+const\s+(\w+):\s*StoryObj\s*=\s*{([\s\S]*?)};/g;
    const storyFnRegex = /export\s+const\s+(\w+):\s*StoryFn\s*=\s*\(\)\s*=>\s*\(\s*{([\s\S]*?)}\s*\);/g;
    const stories = [];

    // Process StoryObj exports
    let objMatch;
    while ((objMatch = storyObjRegex.exec(content)) !== null) {
      const storyName = objMatch[1];
      const storyContent = objMatch[2];

      // Extract template from render function - handle both single line and multi-line templates
      let template = null;

      // Try to match template literals (backticks) for multi-line templates
      const templateLiteralMatch = storyContent.match(/template:\s*`([\s\S]*?)`/);
      if (templateLiteralMatch) {
        template = this.normalizeIndentation(templateLiteralMatch[1], 2);
      } else {
        // For quoted templates, we need to handle nested quotes properly
        // Try single quotes first
        const singleQuoteMatch = storyContent.match(/template:\s*'((?:[^'\\]|\\.)*)'/);
        if (singleQuoteMatch) {
          template = singleQuoteMatch[1];
        } else {
          // Try double quotes with escaped quote handling
          const doubleQuoteMatch = storyContent.match(/template:\s*"((?:[^"\\]|\\.)*)"/);
          if (doubleQuoteMatch) {
            template = doubleQuoteMatch[1];
          }
        }
      }

      // Extract props from render function
      let props = null;
      const propsMatch = storyContent.match(/props:\s*{([\s\S]*?)},?\s*template:/);
      if (propsMatch) {
        props = this.normalizeIndentation(propsMatch[1]);
      }

      // Extract parameters/description - handle multiple formats
      let description = null;

      // Try format: description: { story: 'text' }
      let descriptionMatch = storyContent.match(/description:\s*{\s*story:\s*['"`]([\s\S]*?)['"`]/);
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      } else {
        // Try format: description: 'text'
        descriptionMatch = storyContent.match(/description:\s*['"`]([\s\S]*?)['"`]/);
        if (descriptionMatch) {
          description = descriptionMatch[1].trim();
        }
      }

      stories.push({
        name: storyName,
        template,
        props,
        description,
        fullStory: objMatch[0]
      });
    }

    // Process StoryFn exports
    let fnMatch;
    while ((fnMatch = storyFnRegex.exec(content)) !== null) {
      const storyName = fnMatch[1];
      const storyContent = fnMatch[2];

      // Extract template from StoryFn content
      let template = null;

      const templateLiteralMatch = storyContent.match(/template:\s*`([\s\S]*?)`/);
      if (templateLiteralMatch) {
        template = this.normalizeIndentation(templateLiteralMatch[1]);
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

      // Extract props from StoryFn
      let props = null;
      const propsMatch = storyContent.match(/props:\s*{([\s\S]*?)},?\s*template:/);
      if (propsMatch) {
        props = this.normalizeIndentation(propsMatch[1]);
      }

      // Extract parameters/description - handle multiple formats
      let description = null;

      // Try format: description: { story: 'text' }
      let descriptionMatch = storyContent.match(/description:\s*{\s*story:\s*['"`]([\s\S]*?)['"`]/);
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      } else {
        // Try format: description: 'text'
        descriptionMatch = storyContent.match(/description:\s*['"`]([\s\S]*?)['"`]/);
        if (descriptionMatch) {
          description = descriptionMatch[1].trim();
        }
      }

      stories.push({
        name: storyName,
        template,
        props,
        description,
        fullStory: fnMatch[0]
      });
    }

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
      mdx += ` ${customIntro}

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
