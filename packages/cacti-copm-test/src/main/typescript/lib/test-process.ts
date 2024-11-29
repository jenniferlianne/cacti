import { spawn } from "child_process";

export class TestProcess {
  directory: string;
  command: string;
  args: string[];
  show_progress: boolean;

  constructor(
    directory: string,
    command: string,
    args: string[],
    show_progress = true,
  ) {
    this.directory = directory;
    this.command = command;
    this.args = args;
    this.show_progress = show_progress;
  }

  public idStr(): string {
    return `cd ${this.directory} && ${this.command} ${this.args.join(" ")}`;
  }

  public async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`in run for ${this.idStr()}`);
      const cmd = spawn(this.command, this.args, { cwd: this.directory });
      if (this.show_progress) {
        cmd.stdout.on("data", function (data) {
          console.log(data.toString());
        });

        cmd.stderr.on("data", function (data) {
          console.log(data.toString());
        });
      }
      cmd.on("exit", function (code) {
        console.log(`child process exited with code ${code || "unknown"}`);
        if (code && code != 0) {
          reject(new Error(`Command failed with code ${code}`));
        } else {
          resolve();
        }
      });
      cmd.on("close", function (code) {
        console.log(`child process exited with code ${code || "unknown"}`);
        if (code && code != 0) {
          reject(new Error(`Command failed with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }
}
