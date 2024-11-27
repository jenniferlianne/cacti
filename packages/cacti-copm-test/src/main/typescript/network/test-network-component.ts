export interface TestNetworkComponent {
  start(): Promise<void>;
  stop(): Promise<void>;
  isUp(): Promise<boolean>;
  idStr(): string;
}
