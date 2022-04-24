import path from "path";
import fs from "fs";

interface ParsedPath {
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
}

export interface IFileModel extends ParsedPath {
  url: string;
  size: number;
  createTime: Date;
  updateTime: Date;
}

export class FileModel {
  url: string;
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
  size: number;
  createTime: Date;
  updateTime: Date;
  constructor(args: IFileModel) {
    this.url = args.url;
    this.root = args.root;
    this.base = args.base;
    this.name = args.name;
    this.ext = args.ext;
    this.dir = args.ext;
    this.size = args.size;
    this.createTime = args.createTime;
    this.updateTime = args.updateTime;
  }
}

export interface IDirectoryModel extends ParsedPath {
  url: string;
  children: Array<FileModel | DirectoryModel>;
}

export class DirectoryModel {
  url: string;
  root: string;
  dir: string;
  base: string;
  ext: string;
  name: string;
  child: Array<FileModel | DirectoryModel>;
  constructor(args: IDirectoryModel) {
    this.url = args.url;
    this.root = args.root;
    this.base = args.base;
    this.name = args.name;
    this.ext = args.ext;
    this.dir = args.ext;
    this.child = args.children;
  }
}

export type ReadFileCallback<T> = (
  url: string,
  fileData: FileModel | DirectoryModel
) => T;

export const readDirectory = async function <T>(
  dir: string[],
  filePath: string,
  callback?: ReadFileCallback<T>
): Promise<Array<FileModel | DirectoryModel>> {
  return await Promise.all(
    dir.map((file) => readFileTree(path.join(filePath, file), callback))
  );
};

export const readFileTree = async function <T>(
  url: string,
  callback?: ReadFileCallback<T>
): Promise<FileModel | DirectoryModel> {
  const ParsedPath = path.parse(url);
  const stat = await fs.promises.stat(url);
  if (stat.isFile()) {
    const fileData = new FileModel({
      url,
      ...ParsedPath,
      size: stat.size,
      createTime: stat.birthtime,
      updateTime: stat.mtime,
    });
    if (callback) await callback(url, fileData);
    return fileData;
  } else {
    const dir = await fs.promises.readdir(url);
    const children = await readDirectory(dir, url, callback);
    const dirData = new DirectoryModel({ url, ...ParsedPath, children });
    if (callback) await callback(url, dirData);
    return dirData;
  }
};
