import { http, createConfig, injected } from "wagmi";
import { botchainTestnet } from "./chain";
import { BOTCHAIN_RPC_URL } from "./constants";

export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http(BOTCHAIN_RPC_URL),
  },
  ssr: true,
});
