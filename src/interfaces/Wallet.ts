/* eslint-disable no-unused-vars */
interface IWalletService {
  generate(): string;
}

interface DestinationWallet {
  name: string;
  walletId: string;
}

export { IWalletService, DestinationWallet };
