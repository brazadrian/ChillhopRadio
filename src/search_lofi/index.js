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
async function connectDataBase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("connected to MongoDB!");
  } catch (err) {
    console.log("Error to connected MongoDB!", err);
  }
}

async function searchLofi() {
  try {
    const search = client.db("ChillhopRadio").collection("sounds");
    return await search.aggregate([{ $sample: { size: 1 } }]).toArray();
  } catch (error) {
    console.error("Erro ao buscar itens na coleção:", error);
    throw error;
  }
}
module.exports = {
  searchLofi,
  connectDataBase,
};
