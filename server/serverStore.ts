import * as fs from "fs";
import * as path from "path";
import { FileFolderPath, FileFolderType } from "../common/ServiceContract";
class ServerStore {
  public fileFolderStructure: FileFolderPath;

  constructor() {
    this.fileFolderStructure = this.initializeDirectory();
  }

  private initializeDirectory() {
    let cliArguments = process.argv.slice(2);
    let rootFolder = cliArguments[0];
    let filesAndFolder = fs.readdirSync(rootFolder, { withFileTypes: true });
    let rootDirectory: FileFolderPath = {
      name: "root",
      relativePath: "/",
      type: FileFolderType.Folder,
      children: [],
    };
    this.makePath(rootFolder, rootDirectory, filesAndFolder);
    return rootDirectory;
  }

  private makePath(
    rootFolder: string,
    folder: FileFolderPath,
    children: fs.Dirent[]
  ) {
    children.sort((a: fs.Dirent, b: fs.Dirent) => {
      const intA = Number.parseInt(a.name);
      const intB = Number.parseInt(b.name);
      if (Number.isNaN(intA) || Number.isNaN(intB)) {
        return a.name > b.name ? 1 : -1;
      } else {
        return intA - intB;
      }
    });
    children.forEach((f) => {
      if (f.isDirectory()) {
        let childFolder: FileFolderPath = {
          name: f.name,
          type: FileFolderType.Folder,
          relativePath: path.normalize(path.join(folder.relativePath, f.name)),
          children: [],
        };
        let filesInFolder = fs.readdirSync(
          path.join(rootFolder, folder.relativePath, f.name),
          {
            withFileTypes: true,
          }
        );
        this.makePath(rootFolder, childFolder, filesInFolder);
        folder.children.push(childFolder);
      } else if (f.isFile()) {
        folder.children.push({
          name: f.name,
          type: FileFolderType.File,
          relativePath: path.normalize(path.join(folder.relativePath, f.name)),
          size: (
            fs.statSync(
              path.normalize(path.join(rootFolder, folder.relativePath, f.name))
            ).size / 1000
          ).toString(),
          children: [],
          ext: path.extname(f.name),
        });
      }
    });
  }
}

const instance = new ServerStore();
export { instance as ServerStore };
