import { spawn, ChildProcess } from "child_process";

export class TestService {
  private directory: string;
  private cmd: string;
  private logfile: string;
  private args: string[];
  pid: number;
  private proc: ChildProcess | null;
  private env: any;
  private stopped: boolean;

  constructor(
    directory: string,
    cmd: string,
    args: string[],
    logfile: string,
    env = {},
  ) {
    this.directory = directory;
    this.cmd = cmd;
    this.args = args;
    this.logfile = logfile;
    this.proc = null;
    this.env = env;
    this.pid = -1;
    this.stopped = false;
  }

  public idStr(): string {
    return `cd ${this.directory} && ${JSON.stringify(this.env)} ${this.cmd} ${this.args.join(" ")}`;
  }

  public async start(): Promise<void> {
    const opts = { cwd: this.directory, env: this.env, detached: true };
    const proc = spawn(this.cmd, this.args, opts);
    const service = this;
    proc.stdout.on("data", function (data) {
      console.log(data.toString());
    });

    proc.stderr.on("data", function (data) {
      console.log(data.toString());
    });

    const myId = `${this.cmd} ${this.args.join(" ")}`;
    proc.on("exit", function (code) {
      const err = `test service ${myId} process exited with code ${code}`;
      if (!service.stopped) {
        throw new Error(err);
      }
    });

    proc.on("close", function (code) {
      const err = `test service ${myId} process exited with code ${code}`;
      if (!service.stopped) {
        throw new Error(err);
      }
    });

    this.pid = proc.pid || -1;
    if (this.pid == -1) {
      throw new Error(`test service ${myId} failed to start`);
    }
    this.proc = proc;
    console.log(`TestService ${myId} started pid=${this.pid}`);
  }

  public async stop(): Promise<void> {
    this.stopped = true;
    if (this.pid != -1) {
      await process.kill(this.pid, "SIGKILL");
    }
  }
}
