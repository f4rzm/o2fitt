import PouchDB from '@craftzdog/pouchdb-core-react-native'
import replication from '@craftzdog/pouchdb-replication-react-native'

import SQLite from 'react-native-sqlite-2'
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'
import pouchdbSearch from 'pouchdb-find'

const SQLiteAdapter = SQLiteAdapterFactory(SQLite)

export default PouchDB
  .plugin(replication)
  .plugin(SQLiteAdapter)