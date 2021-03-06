/**
 * Provider using the `firebase` api.
 */
class FirebaseProvider {
	constructor() {
		const { firebaseApp, database, databaseRef } = require('../firebase/Firebase.js');

		this.app = firebaseApp
		this.db = database
		this.rootRef = databaseRef
	}

	/**
	 * Gets a value.
	 * @param {string} id - ID of entry.
	 * @param {string} key - The key to get.
	 * @param {any} [defaultValue] - Default value if not found or null.
	 * @returns {any}
	 */
	async get(id, key, defaultValue) {
		const snapshot = await this.rootRef.child(id || 'global').child(key).once("value")
		const value = snapshot.val()

		return value == null ? defaultValue : value;
	}

	/**
	 * Sets a value.
	 * @param {string} id - ID of entry.
	 * @param {string} key - The key to set.
	 * @param {any} value - The value.
	 * @returns {Promise<Statement>}
	 */
	async set(id, key, value) {
		return this.rootRef.child(id || 'global').child(key).set(value)
	}

	/**
	 * Deletes a value.
	 * @param {string} id - ID of entry.
	 * @param {string} key - The key to delete.
	 * @returns {Promise<Statement>}
	 */
	remove(id, key) {
		return this.rootRef.child(id || 'global').child(key).remove()
	}

	/**
	 * Clears an entry.
	 * @param {string} id - ID of entry.
	 * @returns {Promise<Statement>}
	 */
	async clear(id) {
		if(null === id || 'global' === id) {
			throw new Error('Cant clear')
		}

		return this.rootRef.child(id).remove()
	}
}

module.exports = FirebaseProvider;