const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../scratch/mock_db.json');

const loadDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], checkins: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return { users: [], checkins: [] };
  }
};

const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

class MockQuery {
  constructor(execFn) {
    this.execFn = execFn;
    this._select = null;
    this._sort = null;
    this._limit = null;
  }
  select(arg) { this._select = arg; return this; }
  sort(arg) { this._sort = arg; return this; }
  limit(arg) { this._limit = arg; return this; }
  then(onResolve, onReject) {
    return Promise.resolve(this.execFn(this)).then(onResolve, onReject);
  }
  catch(onReject) {
    return Promise.resolve(this.execFn(this)).catch(onReject);
  }
}

const createMockModel = (modelName, schema, realModel) => {
  const collectionName = modelName.toLowerCase() + 's';

  class MockModel extends realModel {
    constructor(properties) {
      super(properties);
      // Ensure we have a valid 24-character hexadecimal ObjectId
      if (!this._id) {
        this._id = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      }
    }

    async save() {
      const db = loadDb();
      db[collectionName] = db[collectionName] || [];

      // Run pre-save hooks using Kareem (mongoose hooks)
      if (this.schema && this.schema.s && this.schema.s.hooks) {
        await new Promise((resolve, reject) => {
          this.schema.s.hooks.execPre('save', this, [], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      // Convert mongoose doc to plain object
      const docData = this.toObject({ depopulate: true, getters: true, virtuals: false });
      
      // Ensure IDs are strings in JSON file
      if (docData._id && docData._id.toString) {
        docData._id = docData._id.toString();
      }
      if (docData.userId && docData.userId.toString) {
        docData.userId = docData.userId.toString();
      }

      const existingIndex = db[collectionName].findIndex(doc => doc._id === docData._id);

      if (existingIndex > -1) {
        docData.updatedAt = new Date().toISOString();
        db[collectionName][existingIndex] = docData;
      } else {
        docData.createdAt = new Date().toISOString();
        docData.updatedAt = new Date().toISOString();
        db[collectionName].push(docData);
      }

      saveDb(db);
      return this;
    }
  }

  // Static methods
  MockModel.findOne = (query) => {
    return new MockQuery((q) => {
      const db = loadDb();
      const docs = db[collectionName] || [];
      const found = docs.find(doc => {
        for (const [k, v] of Object.entries(query)) {
          const docVal = doc[k] && doc[k].toString ? doc[k].toString() : doc[k];
          const queryVal = v && v.toString ? v.toString() : v;
          if (docVal !== queryVal) return false;
        }
        return true;
      });
      if (!found) return null;

      const instance = new MockModel(found);
      if (q._select && q._select.includes('-password')) {
        instance.password = undefined;
      } else if (q._select && q._select.includes('+password')) {
        // Keep password
      } else {
        if (!q._select || !q._select.includes('+password')) {
          instance.password = undefined;
        }
      }
      return instance;
    });
  };

  MockModel.findById = (id) => {
    const idStr = id && id.toString ? id.toString() : id;
    return new MockQuery((q) => {
      const db = loadDb();
      const docs = db[collectionName] || [];
      const found = docs.find(doc => doc._id === idStr);
      if (!found) return null;

      const instance = new MockModel(found);
      if (q._select && q._select.includes('-password')) {
        instance.password = undefined;
      }
      return instance;
    });
  };

  MockModel.find = (query) => {
    return new MockQuery((q) => {
      const db = loadDb();
      let docs = db[collectionName] || [];

      // Filter
      if (query && Object.keys(query).length > 0) {
        docs = docs.filter(doc => {
          for (const [k, v] of Object.entries(query)) {
            const docVal = doc[k] && doc[k].toString ? doc[k].toString() : doc[k];
            const queryVal = v && v.toString ? v.toString() : v;
            if (docVal !== queryVal) return false;
          }
          return true;
        });
      }

      // Sort
      if (q._sort) {
        const sortKey = Object.keys(q._sort)[0];
        const sortVal = q._sort[sortKey];
        docs.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortVal;
          if (a[sortKey] > b[sortKey]) return -sortVal;
          return 0;
        });
      }

      // Limit
      if (q._limit) {
        docs = docs.slice(0, q._limit);
      }

      return docs.map(doc => new MockModel(doc));
    });
  };

  MockModel.create = async (properties) => {
    const instance = new MockModel(properties);
    await instance.save();
    return instance;
  };

  return MockModel;
};

// Proxy mongoose.model
const originalModel = mongoose.model.bind(mongoose);

mongoose.model = function(name, schema) {
  const realModel = originalModel(name, schema);
  const mockModel = createMockModel(name, schema, realModel);

  const handler = {
    construct(target, args) {
      if (global.useMockDb) {
        return new mockModel(...args);
      }
      return new realModel(...args);
    },
    get(target, prop) {
      if (global.useMockDb) {
        return mockModel[prop];
      }
      return realModel[prop];
    }
  };
  
  return new Proxy(realModel, handler);
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/how-cooked-am-i', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Falling back to a local JSON file-based database for development.');
    global.useMockDb = true;
  }
};

module.exports = connectDB;
