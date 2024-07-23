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

  const [username, setUsername] = useState<string>(usernames);

  const [address, setAddress] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [nameBytes, setNameBytes] = useState<string>("");

  const handleResove = async () => {
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

  const handleCalculateNameBytes = () => {
    const name = usernames.split(".");
    setNameBytes(JSON.stringify(calculateNameByte(name[1], name[0]), null, 2));
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
        <button onClick={handleResove}>Resolve Name</button>
        <button onClick={handleCalculateNameBytes}>Calculate Name Byte</button>
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
      <div>
        <span>name bytes: </span>
        <span>{nameBytes}</span>
      </div>
    </>
  );
}

type NameBytes = {
  name: string;
  bytes: string;
};

const calculateNameByte = (
  labelWallet: string = "uni",
  labelUsername: string = "busjob"
): { eht: NameBytes; wallet: NameBytes; username: NameBytes } => {
  const defaultNameHash = "0x" + "00".repeat(32);
  const labelEth = "eth";

  const nodeDefault = defaultNameHash;
  const idEth = ethers.id(labelEth);
  const subnodeEth = ethers.solidityPackedKeccak256(
    ["bytes"],
    [ethers.solidityPacked(["bytes32", "bytes32"], [nodeDefault, idEth])]
  );

  const nodeEth = ethers.namehash(labelEth);
  const idWallet = ethers.id(labelWallet);
  const subnodeWallet = ethers.solidityPackedKeccak256(
    ["bytes"],
    [ethers.solidityPacked(["bytes32", "bytes32"], [nodeEth, idWallet])]
  );

  const nodeWallet = ethers.namehash(labelWallet);
  const idUsername = ethers.id(labelUsername);
  const subnodeUsername = ethers.solidityPackedKeccak256(
    ["bytes"],
    [ethers.solidityPacked(["bytes32", "bytes32"], [nodeWallet, idUsername])]
  );

  return {
    eht: { name: labelEth, bytes: subnodeEth },
    wallet: { name: labelWallet, bytes: subnodeWallet },
    username: { name: labelUsername, bytes: subnodeUsername },
  };
};

export default App;
