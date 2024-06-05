import Wallet from 'ethereumjs-wallet';
class WalletAddressGenerator {
  static generate(): string {
    const wallet = Wallet.generate();
    return wallet.getAddressString();
  }
}

export { WalletAddressGenerator };
