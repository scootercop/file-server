export enum FileFolderType {
  File,
  Folder,
}

export interface FileFolderPath {
  name: string;
  path: string;
  type: FileFolderType;
  size?: string;
  relativePath: string;
  children: FileFolderPath[];
  ext?: string;
}
