require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function searchLofi(type) {
  try {
    await client.connect();
    const search = client.db("ChillhopRadio").collection("sounds");

    // if (type === "all")
    return await search.aggregate([{ $sample: { size: 1 } }]).toArray();

    // const data = await search
    //   .aggregate([
    //     {
    //       $match: {
    //         lofi_genre: type,
    //       },
    //     },
    //     {
    //       $sample: {
    //         size: 1,
    //       },
    //     },
    //   ])
    //   .toArray();
    // client.close();
    // return data;
  } catch (error) {
    console.error("Erro ao buscar itens na coleção:", error);
    throw error;
  }
}
module.exports = {
  searchLofi,
};
