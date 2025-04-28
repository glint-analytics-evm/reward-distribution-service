import { ethers } from 'ethers';

export function randomUUID() {
  return ethers.uuidV4(ethers.randomBytes(16));
}
