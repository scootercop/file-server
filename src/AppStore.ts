import { computed, observable } from "mobx";
import { FileFolderPath, FileFolderType } from "./ServiceContract";

class AppStore {
  @observable private _fileFolderStructure: FileFolderPath;

  constructor() {
    this._fileFolderStructure = {
      name: "default",
      path: "/",
      relativePath: "/",
      type: FileFolderType.Folder,
      children: [],
    };
  }

  @computed
  public get fileFolderStructure() {
    return this._fileFolderStructure;
  }

  public set fileFolderStructure(value: FileFolderPath) {
    this._fileFolderStructure = value;
  }
}

const instance = new AppStore();
export { instance as AppStore };
