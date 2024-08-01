import Wallet from 'ethereumjs-wallet';
export class WalletGenerator {
  static generateAddress(): string {
    const wallet = Wallet.generate();
    return wallet.getAddressString();
  }
  static generateRandomCryptoValues(): Record<string, number> {
    const cryptos: string[] = ['BTC', 'ETH', 'BNB', 'BCH', 'LTC'];
    const cryptoValues: Record<string, number> = {};

    cryptos.forEach((crypto) => {
      const range = crypto === 'BTC' || crypto === 'ETH' ? 1 : 5;
      cryptoValues[crypto] = parseFloat((Math.random() * range).toFixed(6));
    });

    return cryptoValues;
  }
}

