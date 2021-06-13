export enum FileFolderType {
  File,
  Folder,
}

export interface FileFolderPath {
  name: string;
  type: FileFolderType;
  size?: string;
  relativePath: string;
  children: FileFolderPath[];
  ext?: string;
}
