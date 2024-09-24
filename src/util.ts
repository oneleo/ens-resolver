import { Contract, BigNumberish, BytesLike, ContractRunner } from "ethers";

export class CoinbaseResolverContract {
  private static abi = [
    "function addr(bytes32 node, uint coinType) view public returns(bytes memory)",
    "function addr(bytes32 node) external view returns (address payable)",
  ];

  public readonly address: string;
  private resolver: Contract;

  public static async init(address: string, runner: ContractRunner) {
    const resolver = new Contract(
      address,
      CoinbaseResolverContract.abi,
      runner
    );
    return new CoinbaseResolverContract(resolver, address);
  }

  private constructor(resolver: Contract, address: string) {
    this.resolver = resolver;
    this.address = address;
  }

  public async addr(node: BytesLike): Promise<string> {
    return await this.resolver.addr(node);
  }

  public async addrWithCoinType(
    node: BytesLike,
    coinType: BigNumberish
  ): Promise<BytesLike> {
    return await this.resolver.addr(node, coinType);
  }
}
