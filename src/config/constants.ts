export const BOTCHAIN_CHAIN_ID = 677;
export const BOTCHAIN_WEBSITE_URL = "https://botchain.ai";
export const BOTCHAIN_EXPLORER_URL = "https://scan.botchain.ai";
export const BOTCHAIN_RPC_URL = "https://rpc.botchain.ai";

const rawAddress = (
  process.env.NEXT_PUBLIC_WISH_VAULT_ADDRESS ||
  process.env.NEXT_PUBLIC_BOT_WISH_ADDRESS ||
  ""
).trim();

export const WISH_VAULT_CONTRACT_ADDRESS = (
  rawAddress && rawAddress.startsWith("0x") && rawAddress.length === 42
    ? rawAddress
    : "0xe1d531f3142080CF70e5aD776B13150176f727BA"
) as `0x${string}`;

// Backwards-compatible alias
export const BOT_WISH_CONTRACT_ADDRESS = WISH_VAULT_CONTRACT_ADDRESS;

export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 280;
