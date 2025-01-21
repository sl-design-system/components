import { kebabCase } from 'change-case';

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
export default ({ 
  output, 
  getDirname = (options) => `${options.pageName}${path.sep}${options.dirname}`, 
  getBasename = (options) => `${options.pathToComponent.length?`${kebabCase(options.pathToComponent[0].name)}-`:''}${options.basename}.svg`, 
}) => {
  return (pages) => __awaiter(void 0, void 0, void 0, function* () {
        pages.forEach(({ name: pageName, components }) => {
          const outputFolder = `${output}/${pageName}/icons`;
          console.log(outputFolder);
          components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = Object.assign({ pageName,
                    componentName }, figmaExport);
                // console.log(options, figmaExport.pathToComponent);
                const filePath = path.resolve(outputFolder, getDirname(options));
                fs.mkdirSync(filePath, { recursive: true });
                fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
            });
        });
    });
};
//# sourceMappingURL=index.js.map
