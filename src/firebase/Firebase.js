const Firebase = require("firebase-admin");
const config = require("../../config.json");

const firebaseConfig = {
	credential: Firebase.credential.cert(require("../../firebase-account.json")),
	databaseURL: config.FIREBASE_DB_URL
}

const app = Firebase.initializeApp(firebaseConfig)
const db = app.database()

module.exports = {
	firebaseApp: app,
	database: db,
	databaseRef: db.ref()
}