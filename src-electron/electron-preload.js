/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge } from "electron";
import os from "os";
const fs = require("fs");

const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017/";

contextBridge.exposeInMainWorld("db_manager", {
  get_dbs: async () => {
    let databases;

    const client = new MongoClient(uri);
    async function run() {
      try {
        const admin = client.db("admin");
        const result = await admin.command({ listDatabases: 1 });
        databases = result.databases;
        for (let d of databases) {
          const collections = await client
            .db(d.name)
            .listCollections()
            .toArray();
          d.collections = collections.map((el) => el.name);
        }
      } finally {
        await client.close();
      }
    }

    await run();
    return databases;
  },
  get_collections: async (db_name) => {
    let collections = [];
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);

        collections = await db.listCollections().toArray();
        for (let col of collections) {
          const collect = db.collection(col.name);
          console.dir();
          indexes = await collect.indexes();
          col.indexes = indexes.length;
          col.documents = await collect.countDocuments();
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return collections;
  },
  get_documents: async (
    db_name,
    col_name,
    page = 1,
    query,
    projection,
    options
  ) => {
    let documents = [];
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);

        collection = db.collection(col_name);
        documents = await collection
          .find({}, { limit: 5, skip: (page - 1) * 5 })
          .toArray();
        for (let doc of documents) {
          doc._id = doc._id.toString();
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return documents;
  },
  vider: async (db_name, col_name) => {
    let state = [];
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);
        if (col_name) {
          collection = db.collection(col_name);
          state = await collection.deleteMany({});
        } else {
          state = await db.dropDatabase();
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return state;
  },
  ajouter: async (db_name, col_name, doc) => {
    let state = [];
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);
        if (doc) {
        } else {
          state = await db.createCollection(col_name);
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return state;
  },
  renommer: async (db_name, col_name, new_name) => {
    let collection;
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);

        collection = db.collection(col_name);
        collection = await collection.rename(new_name);
      } finally {
        await client.close();
      }
    }
    await run();
    return collection;
  },
  supprimer: async (db_name, col_name) => {
    let collection;
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);
        if (col_name) {
          collection = db.collection(col_name);
          collection = await collection.drop();
        } else {
          state = await db.dropDatabase();
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return collection;
  },
  remplacer: async ({ db_name, col_name, file_path, type }) => {
    let ins;
    const client = new MongoClient(uri);
    async function run() {
      try {
        let db = client.db(db_name);

        if (type == "col") {
          collection = db.collection(col_name);
          await collection.deleteMany({});

          fs.readFile(file_path, async (err, data) => {
            if (data) {
              data = JSON.parse(data);
              data = data.map((el) => {
                delete el._id;
                return el;
              });
              ins = await collection.insertMany(data);
              await client.close();
            }
          });
        } else if (type == "db") {
          await db.dropDatabase();
          const new_db = client.db(db_name);
          console.log(file_path);
          for (let p of file_path) {
            let col = p.split("\\").at(-1).split(".")[0];
            fs.readFile(p, async (err, data) => {
              if (err) throw err;
              data = JSON.parse(data);
              if (data.length) await new_db.collection(col).insertMany(data);
              else {
                try {
                  await new_db.createCollection(col);
                } catch {
                  //
                }
              }
            });
          }
        }
      } catch {
        throw "erreur";
        await client.close();
      }
    }
    await run();
    return ins;
  },
  importer: async ({ db_name, col_name, file_path, type }) => {
    let ins;
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);
        if (type == "col") {
          collection = db.collection(col_name);
          fs.readFile(file_path, async (err, data) => {
            if (err) ins = err;
            else if (data) {
              data = JSON.parse(data);
              if (Array.isArray(data)) {
                data = data.map((el) => {
                  delete el._id;
                  return el;
                });
                ins = await collection.insertMany(data);
              } else {
                ins = await collect.insertOne(data);
              }

              await client.close();
            }
          });
        } else if (type == "db") {
          for (let p of file_path) {
            let col = p.split("\\").at(-1).split(".")[0];
            console.log(col);
            fs.readFile(p, async (err, data) => {
              if (err) throw err;
              data = JSON.parse(data);
              if (data.length) await db.collection(col).insertMany(data);
              else await db.createCollection(col);
            });
          }
        }
      } catch {
        await client.close();
      }
    }
    await run();
    return ins;
  },
  exporter: async ({ db_name, col_name, file_path, type }) => {
    let ins;
    const client = new MongoClient(uri);
    async function run() {
      try {
        const db = client.db(db_name);
        file_path =
          os.homedir() + "/Downloads/" + file_path.split(".")[0] + "/";

        if (type == "col") {
          collection = db.collection(col_name);
          const docs = await collection
            .find({}, { projection: { _id: 0 } })
            .toArray();

          fs.writeFile(file_path, JSON.stringify(docs), async (err, data) => {
            if (err) ins = err;
          });
        } else if (type == "db") {
          const to_save = { name: db_name, collections: [] };

          collections = await db.listCollections().toArray();
          fs.mkdir(file_path, (err) => {
            if (err) throw err;
          });
          for (let col of collections) {
            // const col_data = { name: col.name };
            let docs = await db
              .collection(col.name)
              .find({}, { projection: { _id: 0 } })
              .toArray();

            // col_data.documents = docs;
            fs.writeFile(
              file_path + col.name + ".json",
              JSON.stringify(docs),
              async (err, data) => {
                if (err) ins = err;
                console.log(
                  file_path + col.name + ".json auvegardée avec succès"
                );
              }
            );
          }
        }
      } finally {
        await client.close();
      }
    }
    await run();
    return ins;
  },
});
