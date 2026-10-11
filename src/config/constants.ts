export const BOTCHAIN_CHAIN_ID = 968;
export const BOTCHAIN_EXPLORER_URL = "https://scan.bohr.life";
export const BOTCHAIN_RPC_URL = "https://rpc.bohr.life";

export const WISH_VAULT_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_WISH_VAULT_ADDRESS ||
  process.env.NEXT_PUBLIC_BOT_WISH_ADDRESS ||
  "0x19F25bDfD4a358A7D2C56c354C1849E7C81De780"
) as `0x${string}`;

// Backwards-compatible alias
export const BOT_WISH_CONTRACT_ADDRESS = WISH_VAULT_CONTRACT_ADDRESS;

export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 280;
