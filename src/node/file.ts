import path, { ParsedPath } from "path";
import fs, { RmOptions } from "fs";
import { Stream } from "stream";
import { checkStringIsSome } from "../common";
import { is } from "../condition";
import { forEach } from "../helper";

const isFileNotEmpty = function (
  file: unknown
): file is FileModel | DirectoryModel {
  return is(file, FileModel) || is(file, DirectoryModel);
};

export interface IFileModel extends Partial<ParsedPath> {
  url: string;
  size?: number;
  createTime?: Date;
  updateTime?: Date;
  data?: Buffer;
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
  data: Buffer;
  constructor(args: IFileModel) {
    this.url = args.url;
    const parsedPath = path.parse(args.url);
    this.root = args.root || parsedPath.root;
    this.base = args.base || parsedPath.base;
    this.name = args.name || parsedPath.name;
    this.ext = args.ext || parsedPath.ext;
    this.dir = args.dir || parsedPath.dir;
    this.size = args.size || 0;
    this.createTime = args.createTime || new Date();
    this.updateTime = args.updateTime || new Date();
    this.data = args.data || Buffer.from("");
  }

  createFile() {
    try {
      return fs.promises.writeFile(this.url, this.data);
    } catch (error) {
      console.error(error);
    }
  }

  async readFile(): Promise<Buffer> {
    try {
      this.data = await fs.promises.readFile(this.url);
    } catch (error) {
      console.error(error);
    }
    return this.data;
  }

  async renameFile(name: string): Promise<void> {
    try {
      await fs.promises.rename(this.url, this.dir + name);
      this.name = name;
    } catch (error) {
      console.error(error);
    }
  }

  async writeFile(data: string | NodeJS.ArrayBufferView | Stream) {
    try {
      await fs.promises.writeFile(this.url, data);
      this.data = await fs.promises.readFile(this.url);
    } catch (error) {
      console.error(error);
    }
  }
}

export interface IDirectoryModel extends Partial<ParsedPath> {
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
  children: Array<FileModel | DirectoryModel>;
  constructor(args: IDirectoryModel) {
    this.url = args.url;
    const parsedPath = path.parse(args.url);
    this.root = args.root || parsedPath.root;
    this.base = args.base || parsedPath.base;
    this.name = args.name || parsedPath.name;
    this.ext = args.ext || parsedPath.ext;
    this.dir = args.dir || parsedPath.dir;
    this.children = args.children ? [...args.children] : [];
  }

  createFolder() {
    try {
      return fs.promises.mkdir(this.url);
    } catch (error) {
      console.error(error);
    }
  }

  async renameFolder(name: string): Promise<void> {
    try {
      await fs.promises.rename(this.url, path.join(this.dir, name));
      this.name = name;
    } catch (error) {
      console.error(error);
    }
  }

  async removeFile(name: string, options?: RmOptions) {
    try {
      const url = path.join(this.dir, name);
      await fs.promises.rm(url, options);
      const index = this.children.map((f) => f.url).indexOf(url);
      return this.children.splice(index, 1)[0];
    } catch (error) {
      console.error(error);
    }
  }

  async removeFolder(name: string) {
    try {
      const url = path.join(this.dir, name);
      await fs.promises.mkdir(path.join(this.dir, name), { recursive: true });
      const index = this.children.map((f) => f.url).indexOf(url);
      return this.children.splice(index, 1)[0];
    } catch (error) {
      console.error(error);
    }
  }

  eachReadFolder(callback: (n: DirectoryModel | FileModel) => Promise<void>) {
    return forEach(this.children, callback);
  }
}

export type ReadFileCallback = (
  url: string,
  fileData: FileModel
) => FileModel | void;

export type ReadDirCallback = (
  url: string,
  fileData: DirectoryModel
) => DirectoryModel | void;

interface ReadFileTreeOptions {
  readFile?: ReadFileCallback;
  readDir?: ReadDirCallback;
  ignore?: string | string[] | RegExp | RegExp[];
}

export const readDirectory = async function (
  url: string,
  options?: Partial<ReadFileTreeOptions>
): Promise<Array<FileModel | DirectoryModel> | null> {
  const dir = await fs.promises.readdir(url);
  if (!fs.existsSync(url)) {
    console.error(`There are no files for "${url}".`);
    return null;
  }
  const dirData = await Promise.all(
    dir.map((file) => readFileTree(path.join(url, file), options))
  );
  return dirData.filter(isFileNotEmpty);
};

export const readFileTree = async function (
  url: string,
  options?: Partial<ReadFileTreeOptions>
): Promise<FileModel | DirectoryModel | null> {
  const { readFile, readDir, ignore } = options || {};
  if (checkStringIsSome(url, ignore)) {
    return null;
  }
  if (!fs.existsSync(url)) {
    console.error(`There are no files for "${url}".`);
    return null;
  }
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
    if (readFile) {
      const result = await readFile(url, fileData);
      if (result instanceof FileModel) return result;
    }
    return fileData;
  } else {
    const children = await readDirectory(url, options);
    const dirData = new DirectoryModel({
      url,
      ...ParsedPath,
      children: children || [],
    });
    if (readDir) {
      const result = await readDir(url, dirData);
      if (result instanceof DirectoryModel) return result;
    }
    return dirData;
  }
};
