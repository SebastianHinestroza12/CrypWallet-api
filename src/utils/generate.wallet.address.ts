import Wallet from 'ethereumjs-wallet';

const generateWalletAddress = (): string => {
  const wallet = Wallet.generate();
  return wallet.getAddressString();
};

export { generateWalletAddress };
