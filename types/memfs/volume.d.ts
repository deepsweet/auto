/// <reference types="node" />
import { Node, Link, File, Stats } from "./node";
import { TSetTimeout } from "./setTimeoutUnref";
import { Readable, Writable } from 'stream';
import { EventEmitter } from "events";
export declare const O_RDONLY: number, O_WRONLY: number, O_RDWR: number, O_CREAT: number, O_EXCL: number, O_NOCTTY: number, O_TRUNC: number, O_APPEND: number, O_DIRECTORY: number, O_NOATIME: number, O_NOFOLLOW: number, O_SYNC: number, O_DIRECT: number, O_NONBLOCK: number, F_OK: number, R_OK: number, W_OK: number, X_OK: number, COPYFILE_EXCL: number, COPYFILE_FICLONE: number, COPYFILE_FICLONE_FORCE: number;
export interface IError extends Error {
    code?: string;
}
export declare type TFilePath = string | Buffer;
export declare type TFileId = TFilePath | number;
export declare type TDataOut = string | Buffer;
export declare type TData = TDataOut | Uint8Array;
export declare type TFlags = string | number;
export declare type TMode = string | number;
export declare type TEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'latin1' | 'binary' | 'hex';
export declare type TEncodingExtended = TEncoding | 'buffer';
export declare type TTime = number | string | Date;
export declare type TCallback<TData> = (error?: IError, data?: TData) => void;
export declare enum FLAGS {
    r,
    'r+',
    rs,
    sr,
    'rs+',
    'sr+',
    w,
    wx,
    xw,
    'w+',
    'wx+',
    'xw+',
    a,
    ax,
    xa,
    'a+',
    'ax+',
    'xa+'
}
export declare type TFlagsCopy = typeof COPYFILE_EXCL | typeof COPYFILE_FICLONE | typeof COPYFILE_FICLONE_FORCE;
export declare function flagsToNumber(flags: TFlags): number;
export interface IOptions {
    encoding?: TEncoding | TEncodingExtended;
}
export interface IFileOptions extends IOptions {
    mode?: TMode;
    flag?: TFlags;
}
export interface IReadFileOptions extends IOptions {
    flag?: string;
}
export interface IWriteFileOptions extends IFileOptions {
}
export interface IAppendFileOptions extends IFileOptions {
}
export interface IRealpathOptions {
    encoding?: TEncodingExtended;
}
export interface IWatchFileOptions {
    persistent?: boolean;
    interval?: number;
}
export interface IReadStreamOptions {
    flags?: TFlags;
    encoding?: TEncoding;
    fd?: number;
    mode?: TMode;
    autoClose?: boolean;
    start?: number;
    end?: number;
}
export interface IWriteStreamOptions {
    flags?: TFlags;
    defaultEncoding?: TEncoding;
    fd?: number;
    mode?: TMode;
    autoClose?: boolean;
    start?: number;
}
export interface IWatchOptions extends IOptions {
    persistent?: boolean;
    recursive?: boolean;
}
export declare function pathToFilename(path: TFilePath): string;
export declare function filenameToSteps(filename: string, base?: string): string[];
export declare function pathToSteps(path: TFilePath): string[];
export declare function dataToStr(data: TData, encoding?: string): string;
export declare function dataToBuffer(data: TData, encoding?: string): Buffer;
export declare function strToEncoding(str: string, encoding?: TEncodingExtended): TDataOut;
export declare function bufferToEncoding(buffer: Buffer, encoding?: TEncodingExtended): TDataOut;
export declare function toUnixTimestamp(time: any): any;
/**
 * `Volume` represents a file system.
 */
export declare class Volume {
    static fromJSON(json: {
        [filename: string]: string;
    }, cwd?: string): Volume;
    /**
     * Global file descriptor counter. UNIX file descriptors start from 0 and go sequentially
     * up, so here, in order not to conflict with them, we choose some big number and descrease
     * the file descriptor of every new opened file.
     * @type {number}
     * @todo This should not be static, right?
     */
    static fd: number;
    root: Link;
    ino: number;
    inodes: {
        [ino: number]: Node;
    };
    releasedInos: number[];
    fds: {
        [fd: number]: File;
    };
    releasedFds: any[];
    maxFiles: number;
    openFiles: number;
    StatWatcher: new () => StatWatcher;
    ReadStream: new (...args: any[]) => IReadStream;
    WriteStream: new (...args: any[]) => IWriteStream;
    FSWatcher: new () => FSWatcher;
    props: {
        Node: new (...args: any[]) => Node;
        Link: new (...args: any[]) => Link;
        File: new (...File: any[]) => File;
    };
    constructor(props?: {});
    createLink(): Link;
    createLink(parent: Link, name: string, isDirectory?: boolean, perm?: number): Link;
    deleteLink(link: Link): boolean;
    private newInoNumber;
    private newFdNumber;
    createNode(isDirectory?: boolean, perm?: number): Node;
    private getNode;
    private deleteNode;
    genRndStr(): any;
    getLink(steps: string[]): Link;
    getLinkOrThrow(filename: string, funcName?: string): Link;
    getResolvedLink(filenameOrSteps: string | string[]): Link;
    getResolvedLinkOrThrow(filename: string, funcName?: string): Link;
    resolveSymlinks(link: Link): Link;
    private getLinkAsDirOrThrow;
    private getLinkParent;
    private getLinkParentAsDirOrThrow;
    private getFileByFd;
    private getFileByFdOrThrow;
    private getNodeByIdOrCreate;
    private wrapAsync;
    private _toJSON;
    toJSON(paths?: TFilePath | TFilePath[], json?: {}, isRelative?: boolean): {};
    fromJSON(json: {
        [filename: string]: string;
    }, cwd?: string): void;
    reset(): void;
    mountSync(mountpoint: string, json: {
        [filename: string]: string;
    }): void;
    private openLink;
    private openFile;
    private openBase;
    openSync(path: TFilePath, flags: TFlags, mode?: TMode): number;
    open(path: TFilePath, flags: TFlags, /* ... */ callback: TCallback<number>): any;
    open(path: TFilePath, flags: TFlags, mode: TMode, callback: TCallback<number>): any;
    private closeFile;
    closeSync(fd: number): void;
    close(fd: number, callback: TCallback<void>): void;
    private openFileOrGetById;
    private readBase;
    readSync(fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, position: number): number;
    read(fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, position: number, callback: (err?: Error, bytesRead?: number, buffer?: Buffer | Uint8Array) => void): void;
    private readFileBase;
    readFileSync(file: TFileId, encoding: string): string;
    readFile(id: TFileId, callback: TCallback<TDataOut>): any;
    readFile(id: TFileId, options: IReadFileOptions | string, callback: TCallback<TDataOut>): any;
    private writeBase;
    writeSync(fd: number, buffer: Buffer | Uint8Array, offset?: number, length?: number, position?: number): number;
    writeSync(fd: number, str: string, position?: number, encoding?: TEncoding): number;
    write(fd: number, buffer: Buffer | Uint8Array, callback: (...args: any[]) => void): any;
    write(fd: number, buffer: Buffer | Uint8Array, offset: number, callback: (...args: any[]) => void): any;
    write(fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, callback: (...args: any[]) => void): any;
    write(fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, position: number, callback: (...args: any[]) => void): any;
    write(fd: number, str: string, callback: (...args: any[]) => void): any;
    write(fd: number, str: string, position: number, callback: (...args: any[]) => void): any;
    write(fd: number, str: string, position: number, encoding: TEncoding, callback: (...args: any[]) => void): any;
    private writeFileBase;
    writeFileSync(id: TFileId, data: TData, options?: IWriteFileOptions): void;
    writeFile(id: TFileId, data: TData, callback: TCallback<void>): any;
    writeFile(id: TFileId, data: TData, options: IWriteFileOptions | string, callback: TCallback<void>): any;
    private linkBase;
    private copyFileBase;
    copyFileSync(src: TFilePath, dest: TFilePath, flags?: TFlagsCopy): void;
    copyFile(src: TFilePath, dest: TFilePath, callback: TCallback<void>): any;
    copyFile(src: TFilePath, dest: TFilePath, flags: TFlagsCopy, callback: TCallback<void>): any;
    linkSync(existingPath: TFilePath, newPath: TFilePath): void;
    link(existingPath: TFilePath, newPath: TFilePath, callback: TCallback<void>): void;
    private unlinkBase;
    unlinkSync(path: TFilePath): void;
    unlink(path: TFilePath, callback: TCallback<void>): void;
    private symlinkBase;
    symlinkSync(target: TFilePath, path: TFilePath, type?: 'file' | 'dir' | 'junction'): void;
    symlink(target: TFilePath, path: TFilePath, callback: TCallback<void>): any;
    symlink(target: TFilePath, path: TFilePath, type: 'file' | 'dir' | 'junction', callback: TCallback<void>): any;
    private realpathBase;
    realpathSync(path: TFilePath, options?: IRealpathOptions): TDataOut;
    realpath(path: TFilePath, callback: TCallback<TDataOut>): any;
    realpath(path: TFilePath, options: IRealpathOptions | string, callback: TCallback<TDataOut>): any;
    private lstatBase;
    lstatSync(path: TFilePath): Stats;
    lstat(path: TFilePath, callback: TCallback<Stats>): void;
    private statBase;
    statSync(path: TFilePath): Stats;
    stat(path: TFilePath, callback: TCallback<Stats>): void;
    private fstatBase;
    fstatSync(fd: number): Stats;
    fstat(fd: number, callback: TCallback<Stats>): void;
    private renameBase;
    renameSync(oldPath: TFilePath, newPath: TFilePath): void;
    rename(oldPath: TFilePath, newPath: TFilePath, callback: TCallback<void>): void;
    private existsBase;
    existsSync(path: TFilePath): boolean;
    exists(path: TFilePath, callback: (exists: boolean) => void): void;
    private accessBase;
    accessSync(path: TFilePath, mode?: number): void;
    access(path: TFilePath, callback: TCallback<void>): any;
    access(path: TFilePath, mode: number, callback: TCallback<void>): any;
    appendFileSync(id: TFileId, data: TData, options?: IAppendFileOptions | string): void;
    appendFile(id: TFileId, data: TData, callback: TCallback<void>): any;
    appendFile(id: TFileId, data: TData, options: IAppendFileOptions, callback: TCallback<void>): any;
    private readdirBase;
    readdirSync(path: TFilePath, options?: IOptions | string): TDataOut[];
    readdir(path: TFilePath, callback: TCallback<TDataOut[]>): any;
    readdir(path: TFilePath, options: IOptions | string, callback: TCallback<TDataOut[]>): any;
    private readlinkBase;
    readlinkSync(path: TFilePath, options?: IOptions): TDataOut;
    readlink(path: TFilePath, callback: TCallback<TDataOut>): any;
    readlink(path: TFilePath, options: IOptions, callback: TCallback<TDataOut>): any;
    private fsyncBase;
    fsyncSync(fd: number): void;
    fsync(fd: number, callback: TCallback<void>): void;
    private fdatasyncBase;
    fdatasyncSync(fd: number): void;
    fdatasync(fd: number, callback: TCallback<void>): void;
    private ftruncateBase;
    ftruncateSync(fd: number, len?: number): void;
    ftruncate(fd: number, callback: TCallback<void>): any;
    ftruncate(fd: number, len: number, callback: TCallback<void>): any;
    private truncateBase;
    truncateSync(id: TFileId, len?: number): void;
    truncate(id: TFileId, callback: TCallback<void>): any;
    truncate(id: TFileId, len: number, callback: TCallback<void>): any;
    private futimesBase;
    futimesSync(fd: number, atime: TTime, mtime: TTime): void;
    futimes(fd: number, atime: TTime, mtime: TTime, callback: TCallback<void>): void;
    private utimesBase;
    utimesSync(path: TFilePath, atime: TTime, mtime: TTime): void;
    utimes(path: TFilePath, atime: TTime, mtime: TTime, callback: TCallback<void>): void;
    private mkdirBase;
    mkdirSync(path: TFilePath, mode?: TMode): void;
    mkdir(path: TFilePath, callback: TCallback<void>): any;
    mkdir(path: TFilePath, mode: TMode, callback: TCallback<void>): any;
    private mkdtempBase;
    mkdtempSync(prefix: string, options?: IOptions): TDataOut;
    mkdtemp(prefix: string, callback: TCallback<void>): any;
    mkdtemp(prefix: string, options: IOptions, callback: TCallback<void>): any;
    /**
     * Creates directory tree recursively.
     * @param filename
     * @param modeNum
     */
    private mkdirpBase;
    mkdirpSync(path: TFilePath, mode?: TMode): void;
    mkdirp(path: TFilePath, callback: TCallback<void>): any;
    mkdirp(path: TFilePath, mode: TMode, callback: TCallback<void>): any;
    private rmdirBase;
    rmdirSync(path: TFilePath): void;
    rmdir(path: TFilePath, callback: TCallback<void>): void;
    private fchmodBase;
    fchmodSync(fd: number, mode: TMode): void;
    fchmod(fd: number, mode: TMode, callback: TCallback<void>): void;
    private chmodBase;
    chmodSync(path: TFilePath, mode: TMode): void;
    chmod(path: TFilePath, mode: TMode, callback: TCallback<void>): void;
    private lchmodBase;
    lchmodSync(path: TFilePath, mode: TMode): void;
    lchmod(path: TFilePath, mode: TMode, callback: TCallback<void>): void;
    private fchownBase;
    fchownSync(fd: number, uid: number, gid: number): void;
    fchown(fd: number, uid: number, gid: number, callback: TCallback<void>): void;
    private chownBase;
    chownSync(path: TFilePath, uid: number, gid: number): void;
    chown(path: TFilePath, uid: number, gid: number, callback: TCallback<void>): void;
    private lchownBase;
    lchownSync(path: TFilePath, uid: number, gid: number): void;
    lchown(path: TFilePath, uid: number, gid: number, callback: TCallback<void>): void;
    private statWatchers;
    watchFile(path: TFilePath, listener: (curr: Stats, prev: Stats) => void): StatWatcher;
    watchFile(path: TFilePath, options: IWatchFileOptions, listener: (curr: Stats, prev: Stats) => void): StatWatcher;
    unwatchFile(path: TFilePath, listener?: (curr: Stats, prev: Stats) => void): void;
    createReadStream(path: TFilePath, options?: IReadStreamOptions | string): IReadStream;
    createWriteStream(path: TFilePath, options?: IWriteStreamOptions | string): IWriteStream;
    watch(path: TFilePath, options?: IWatchOptions | string, listener?: (eventType: string, filename: string) => void): FSWatcher;
}
export declare class StatWatcher extends EventEmitter {
    vol: Volume;
    filename: string;
    interval: number;
    timeoutRef: any;
    setTimeout: TSetTimeout;
    prev: Stats;
    constructor(vol: Volume);
    private loop;
    private hasChanged;
    private onInterval;
    start(path: string, persistent?: boolean, interval?: number): void;
    stop(): void;
}
export interface IReadStream extends Readable {
    new (path: TFilePath, options: IReadStreamOptions): any;
    open(): any;
    close(callback: TCallback<void>): any;
    bytesRead: number;
    path: string;
}
export interface IWriteStream extends Writable {
    bytesWritten: number;
    path: string;
    new (path: TFilePath, options: IWriteStreamOptions): any;
    open(): any;
    close(): any;
}
export declare class FSWatcher extends EventEmitter {
    _vol: Volume;
    _filename: string;
    _steps: string[];
    _filenameEncoded: TDataOut;
    _recursive: boolean;
    _encoding: TEncoding;
    _link: Link;
    _timer: any;
    constructor(vol: Volume);
    private _getName;
    private _onNodeChange;
    private _onParentChild;
    private _emit;
    private _persist;
    start(path: TFilePath, persistent?: boolean, recursive?: boolean, encoding?: TEncoding): void;
    close(): void;
}
