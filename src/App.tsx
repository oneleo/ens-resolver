import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as ethers from "ethers";
import "./App.css";

const providerOptions = {
  chainId: 1,
  name: "mainnet",
  ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
};
const providerUrl = `https://eth-mainnet.g.alchemy.com/v2/${
  import.meta.env.VITE_ALCHEMY_TOKEN
}`;
const usernames = import.meta.env.VITE_USERNAMES;

function App() {
  const [count, setCount] = useState(0);

  const resover = async () => {
    console.log(`usernames: ${usernames}`);

    const provider = new ethers.JsonRpcProvider(providerUrl);
    const resolver = await provider.getResolver(usernames);
    // Refer to:
    // https://github.com/Uniswap/interface/blob/5ab53568c0d4caf3ed0846172417e41f3b66f78c/packages/wallet/src/features/ens/api.ts
    const address = await provider.resolveName(usernames);
    const avatar = await provider.getAvatar(usernames);
    const description = await resolver?.getText("description");
    const twitter = await resolver?.getText("twitter");

    console.log(`address: ${address}`);
    console.log(`avatar: ${avatar}`);
    console.log(`description: ${description}`);
    console.log(`twitter: ${twitter}`);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={resover}>resover</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
