interface QRCodeOptions {
    sourceChain: string;
    sourceToken: string;
    recipientAddress: string;
    amount: string;
  }
  
  const FIXED_ETH_GAS = 21000;
  const FIXED_ERC20_GAS = 60000;
  
  const getQRCodeURI = ({ sourceChain, sourceToken, recipientAddress, amount }: QRCodeOptions): string => {
    let uri = '';
  
    switch (sourceChain?.toLowerCase()) {
      case 'bitcoin':
        if (sourceToken?.toLowerCase() === 'btc') {
          uri = `bitcoin:${recipientAddress}?amount=${amount}`;
        }
        break;
  
      case 'ethereum':
      case 'arbitrum':
        uri = `ethereum:${recipientAddress}?value=${amount}`;
        if (sourceToken.toLowerCase() !== 'eth') {
          uri += `&contractAddress=${getContractAddress(sourceToken.toLowerCase())}`;
          uri += `&gas=${FIXED_ERC20_GAS}`;
        } else {
          uri += `&gas=${FIXED_ETH_GAS}`;
        }
        break;
  
      case 'polkadot':
        if (sourceToken.toLowerCase() === 'dot') {
          uri = `polkadot:${recipientAddress}?amount=${amount}`;
        }
        break;
  
      default:
        throw new Error('Unsupported chain or token');
    }
  
    return uri;
  };
  
  const getContractAddress = (token: string): string => {
    const tokenContracts: { [key: string]: string } = {
      usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT ERC-20
      usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC ERC-20
    };
  
    return tokenContracts[token] || '';
  };
  
  export const generateQRCodeURI = (options: QRCodeOptions): string => {
    return getQRCodeURI(options);
  };
  