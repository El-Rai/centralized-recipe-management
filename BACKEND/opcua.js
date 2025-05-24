const opcua = require("node-opcua");

async function sendToMachine(machineName, values, config) {
  const { endpoint, nodes } = config;

  const client = opcua.OPCUAClient.create();
  await client.connect(endpoint);

  const session = await client.createSession();

  for (const [key, val] of Object.entries(values)) {
    const nodeId = nodes[key];
    if (!nodeId) continue;

    const variant = {
      dataType: typeof val === "number" ? opcua.DataType.Double : opcua.DataType.String,
      value: val
    };

    console.log(`Writing ${val} to ${nodeId} on ${machineName}`);
    await session.writeSingleNode(nodeId, new opcua.Variant(variant));
  }

  await session.close();
  await client.disconnect();
}

module.exports = { sendToMachine };
