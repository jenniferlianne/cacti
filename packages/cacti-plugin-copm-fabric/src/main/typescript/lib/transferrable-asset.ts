import { Code, ConnectError } from "@connectrpc/connect";

export class TransferrableAsset {
  private assetId: string | undefined;
  private assetQuantity: number | undefined;

  constructor(assetId: string | undefined, assetQuantity: number | undefined) {
    this.assetId = assetId;
    this.assetQuantity = assetQuantity;
  }

  public isNFT(): boolean {
    if (this.assetId) {
      return true;
    } else {
      return false;
    }
  }

  public idOrQuantity(): string {
    if (this.assetId) {
      return this.assetId;
    } else if (this.assetQuantity) {
      return this.assetQuantity.toString();
    } else {
      throw new ConnectError(
        "Either assetQuantity or assetId must be supplied",
        Code.InvalidArgument,
      );
    }
  }
}
