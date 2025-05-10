declare module "envjsc" {
  import { EventEmitter } from "events";
  import { Stats, Dirent } from "fs";
  import { Server, ClientRequest, IncomingMessage, ServerResponse } from "http";
  import { ChildProcess } from "child_process";
  import { Hash, Hmac } from "crypto";
  import { Socket } from "net";
  import { Readable, Writable, Duplex, Transform } from "stream";
  import { UserInfo, CpuInfo } from "os";
  import { URL, Url } from "url";

  /**
   * File system operations.
   * @interface FileModule
   */
  interface FileModule {
    /**
     * Reads a file synchronously.
     * @param filename The path to the file.
     * @param encoding The file encoding. Defaults to 'utf8'.
     * @returns The file content.
     * @throws If the file cannot be read.
     * @example
     * const content = file.readFileSync("example.txt");
     * console.log(content);
     */
    readFileSync(filename: string, encoding?: string): string;

    /**
     * Reads a file asynchronously.
     * @param filename The path to the file.
     * @param encoding The file encoding. Defaults to 'utf8'.
     * @returns A promise that resolves with the file content.
     * @example
     * const content = await file.readFile("example.txt");
     * console.log(content);
     */
    readFile(filename: string, encoding?: string): Promise<string>;

    /**
     * Writes data to a file synchronously.
     * @param filename The path to the file.
     * @param data The data to write.
     * @param encoding The file encoding. Defaults to 'utf8'.
     * @throws If the file cannot be written.
     */
    writeFileSync(filename: string, data: string | Buffer, encoding?: string): void;

    /**
     * Writes data to a file asynchronously.
     * @param filename The path to the file.
     * @param data The data to write.
     * @param encoding The file encoding. Defaults to 'utf8'.
     * @returns A promise that resolves when the file is written.
     */
    writeFile(filename: string, data: string | Buffer, encoding?: string): Promise<void>;

    /**
     * Checks if a file exists synchronously.
     * @param filename The path to the file.
     * @returns True if the file exists, false otherwise.
     */
    existsSync(filename: string): boolean;

    /**
     * Checks if a file exists asynchronously.
     * @param filename The path to the file.
     * @param mode The mode to check (e.g., fs.constants.F_OK). Defaults to fs.constants.F_OK.
     * @returns A promise that resolves with true if the file exists, false otherwise.
     */
    exists(filename: string, mode?: number): Promise<boolean>;

    /**
     * Reads the content of a directory synchronously.
     * @param dirPath The path to the directory.
     * @param options Options for reading the directory.
     * @returns An array of filenames or Dirent objects.
     * @throws If the directory cannot be read.
     */
    readDirSync(
      dirPath: string,
      options?: { encoding?: string; withFileTypes?: boolean }
    ): string[] | Dirent[];

    /**
     * Reads the content of a directory asynchronously.
     * @param dirPath The path to the directory.
     * @param options Options for reading the directory.
     * @returns A promise that resolves with an array of filenames or Dirent objects.
     */
    readDir(
      dirPath: string,
      options?: { encoding?: string; withFileTypes?: boolean }
    ): Promise<string[] | Dirent[]>;

    /**
     * Creates a directory synchronously.
     * @param dirPath The path to the directory.
     * @param options Options for creating the directory.
     * @returns The first directory path created if recursive, undefined otherwise.
     * @throws If the directory cannot be created.
     */
    makeDirSync(dirPath: string, options?: { recursive?: boolean }): string | undefined;

    /**
     * Creates a directory asynchronously.
     * @param dirPath The path to the directory.
     * @param options Options for creating the directory.
     * @returns A promise that resolves with the first directory path created if recursive, undefined otherwise.
     */
    makeDir(dirPath: string, options?: { recursive?: boolean }): Promise<string | undefined>;

    /**
     * Deletes a file synchronously.
     * @param filePath The path to the file.
     * @throws If the file cannot be deleted.
     */
    deleteFileSync(filePath: string): void;

    /**
     * Deletes a file asynchronously.
     * @param filePath The path to the file.
     * @returns A promise that resolves when the file is deleted.
     */
    deleteFile(filePath: string): Promise<void>;

    /**
     * Removes a directory synchronously.
     * @param dirPath The path to the directory.
     * @param options Options for removing the directory.
     * @throws If the directory cannot be removed.
     */
    removeDirSync(dirPath: string, options?: { recursive?: boolean }): void;

    /**
     * Removes a directory asynchronously.
     * @param dirPath The path to the directory.
     * @param options Options for removing the directory.
     * @returns A promise that resolves when the directory is removed.
     */
    removeDir(dirPath: string, options?: { recursive?: boolean }): Promise<void>;

    /**
     * Renames a file or directory synchronously.
     * @param oldPath The current path.
     * @param newPath The new path.
     * @throws If the file or directory cannot be renamed.
     */
    renameSync(oldPath: string, newPath: string): void;

    /**
     * Renames a file or directory asynchronously.
     * @param oldPath The current path.
     * @param newPath The new path.
     * @returns A promise that resolves when the file or directory is renamed.
     */
    rename(oldPath: string, newPath: string): Promise<void>;

    /**
     * Gets file status synchronously.
     * @param filePath The path to the file.
     * @returns File status object.
     * @throws If the file status cannot be retrieved.
     */
    statSync(filePath: string): Stats;

    /**
     * Gets file status asynchronously.
     * @param filePath The path to the file.
     * @returns A promise that resolves with the file status object.
     */
    stat(filePath: string): Promise<Stats>;
  }

  /**
   * HTTP server and client functionality.
   * @interface HttpModule
   */
  interface HttpModule {
    /**
     * Enables CORS headers for the HTTP server.
     * @param options CORS configuration.
     * @example
     * http.enableCORS({ origins: ["https://example.com"] });
     */
    enableCORS(options?: {
      /** Allowed origins. Defaults to ["*"]. */
      origins?: string[];
      /** Allowed methods. Defaults to ["GET", "POST", "PUT", "DELETE", "OPTIONS"]. */
      methods?: string[];
      /** Allowed headers. Defaults to ["Content-Type", "Authorization"]. */
      headers?: string[];
    }): void;

    /**
     * Creates an HTTP server.
     * @param callback Request listener.
     * @returns The HTTP server instance.
     * @example
     * http.createServer((req, res) => {
     *   res.writeHead(200);
     *   res.end("Hello");
     * });
     */
    createServer(callback: (req: IncomingMessage, res: ServerResponse) => void): Server;

    /**
     * Makes an HTTP GET request (Node.js native style).
     * @param url The URL to request.
     * @param options Request options.
     * @param callback Callback with the response.
     * @returns The client request object.
     */
    get(
      url: string | URL,
      options?: object,
      callback?: (res: IncomingMessage | null, data: string | null, err: Error | null) => void
    ): ClientRequest;

    /**
     * Makes an HTTP request with a fetch-like interface.
     * @param url The URL or Request object.
     * @param options Request options (method, headers, body, etc.).
     * @returns A promise that resolves with the Response object.
     * @example
     * const response = await http.fetch("https://api.example.com");
     * console.log(await response.json());
     */
    fetch(url: string | URL | Request, options?: {
      method?: string;
      headers?: Record<string, string>;
      body?: string | Buffer | object;
    }): Promise<{
      ok: boolean;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      text(): Promise<string>;
      json(): Promise<any>;
    }>;
  }

  /**
   * Operating system utilities.
   * @interface OsModule
   */
  interface OsModule {
    /** Gets current user information. */
    userInfo(): UserInfo<string>;
    /** Gets free system memory in bytes. */
    freemem(): number;
    /** Gets total system memory in bytes. */
    totalmem(): number;
    /** Gets the operating system CPU architecture. */
    arch(): string;
    /** Gets an array of objects containing information about each logical CPU core. */
    cpus(): CpuInfo[];
    /** Gets the system hostname. */
    hostname(): string;
    /** Gets the operating system platform. */
    platform(): string;
    /** Gets the operating system release. */
    release(): string;
    /** Gets the system uptime in seconds. */
    uptime(): number;
    /** Gets the average system load over the last 1, 5, and 15 minutes. */
    loadavg(): number[];
  }

  /**
   * Path manipulation utilities.
   * @interface PathModule
   */
  interface PathModule {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(p: string): string;
    basename(p: string, ext?: string): string;
    extname(p: string): string;
    normalize(p: string): string;
    sep: string;
  }

  /**
   * Process information.
   * @interface ProcessModule
   */
  interface ProcessModule {
    cwd(): string;
    env(): NodeJS.ProcessEnv;
    argv(): string[];
    version(): string;
    memoryUsage(): NodeJS.MemoryUsage;
    exit(code?: number): never;
    pid(): number;
    title(): string;
  }

  /**
   * Child process functionality.
   * @interface ChildProcessModule
   */
  interface ChildProcessModule {
    spawn(command: string, args?: string[], options?: object): ChildProcess;
    exec(
      command: string,
      options?: object,
      callback?: (error: Error | null, stdout: string, stderr: string) => void
    ): ChildProcess;
    execAsync(command: string, options?: object): Promise<{ stdout: string; stderr: string }>;
    execSync(command: string, options?: object): Buffer | string;
  }
}