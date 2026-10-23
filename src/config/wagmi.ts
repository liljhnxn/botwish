import { http, createConfig, injected } from "wagmi";
import { botchainMainnet } from "./chain";
import { BOTCHAIN_RPC_URL } from "./constants";

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(BOTCHAIN_RPC_URL),
  },
  ssr: true,
});
