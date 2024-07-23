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
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [error, setError] = useState<string>("");

  const resover = async () => {
    setLoading(true);
    setUsername(usernames);

    try {
      setError("");
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const resolver = await provider.getResolver(usernames);
      // Refer to:
      // https://github.com/Uniswap/interface/blob/5ab53568c0d4caf3ed0846172417e41f3b66f78c/packages/wallet/src/features/ens/api.ts
      const userAddress = await provider.resolveName(usernames);
      const userAvatar = await provider.getAvatar(usernames);
      const userDescription = await resolver?.getText("description");
      const userTwitter = await resolver?.getText("com.twitter");

      setAddress(userAddress ?? "");
      setAvatar(userAvatar ?? "");
      setDescription(userDescription ?? "");
      setTwitter(userTwitter ?? "");
    } catch (error) {
      setError((error as any).message);
      console.error("Error resolving ENS name:", error);
    } finally {
      setLoading(false);
    }
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
      <div>
        <span>username: </span>
        <span>{username}</span>
      </div>
      <div>
        <span>address: </span>
        <span>{loading ? "loading..." : address}</span>
      </div>
      <div>
        <span>avatar: </span>
        <span>{loading ? "loading..." : avatar}</span>
      </div>
      <div>
        <span>description: </span>
        <span>{loading ? "loading..." : description}</span>
      </div>
      <div>
        <span>twitter: </span>
        <span>{loading ? "loading..." : twitter}</span>
      </div>
      <div>
        <span>error: </span>
        <span>{loading ? "loading..." : error}</span>
      </div>
    </>
  );
}

export default App;
