export interface TestNetwork {
  start(): Promise<void>;
  stop(): Promise<void>;
}
