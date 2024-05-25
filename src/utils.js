import { formatUnits } from 'ethers';

export const formatHexToHumanReadable = (hexValue, unit = 'ether') => {
  try {
    if (typeof hexValue === 'string' && hexValue.startsWith('0x')) {
      return formatUnits(hexValue, unit);
    }
    return hexValue.toString();
  } catch (error) {
    console.error('Error formatting value:', error);
    return 'Invalid value';
  }
};

