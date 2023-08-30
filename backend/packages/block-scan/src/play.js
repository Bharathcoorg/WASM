require("dotenv").config();

const {
  chain: { getApi, setSpecHeights },
} = require("@osn/scan-common");
const { handleBlock } = require("./scan");

async function main() {
  const blockHeights = [299347];

  const api = await getApi();
  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await handleBlock({
      height,
      block: block.block,
      events: allEvents,
    });
  }

  console.log("finished");
  process.exit(0);
}

main().then(console.log);
