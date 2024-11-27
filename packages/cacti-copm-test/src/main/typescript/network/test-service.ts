import { spawn } from "child_process";
import { TestNetworkComponent } from "./test-network-component";
import * as fs from "fs";
import * as path from "path";

export class TestService implements TestNetworkComponent {
  private directory: string;
  private cmd: string;
  private logfile: string;
  private args: string[];
  pid: number;
  private uniqueId: string;
  private env: any;
  private stopped: boolean;

  constructor(
    uniqueId: string,
    directory: string,
    cmd: string,
    args: string[],
    env = {},
  ) {
    this.uniqueId = uniqueId;
    this.directory = directory;
    this.cmd = cmd;
    this.args = args;
    this.logfile = "/tmp/" + uniqueId + ".log";
    this.env = env;
    this.pid = -1;
    this.stopped = false;
  }

  public idStr(): string {
    return `cd ${this.directory} && ${JSON.stringify(this.env)} ${this.cmd} ${this.args.join(" ")}`;
  }

  public async isUp(): Promise<boolean> {
    const pidFile = this.pidFilePath();
    if (fs.existsSync(pidFile)) {
      const pid = parseInt(fs.readFileSync(pidFile, "utf-8"), 10);
      try {
        process.kill(pid, 0);
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
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

    const myId = this.idStr();
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

    fs.writeFileSync(this.pidFilePath(), this.pid.toString(), "utf-8");
    console.log(`TestService ${myId} started pid=${this.pid}`);
  }

  public async stop(): Promise<void> {
    this.stopped = true;
    if (this.pid != -1) {
      await process.kill(this.pid, "SIGKILL");
    }
  }

  private pidFilePath(): string {
    return path.join("/tmp", `${this.uniqueId}.pid`);
  }
}
