// I can't get "mock.instances" to work properly w/ jest
// so this will have to do..

function Client() {}
Client.prototype.release = jest.fn()

function Connection() {}

function Pool() {}
Pool.prototype.connect = jest.fn(() => new Client())
Pool.prototype.end = jest.fn()
Pool.prototype.query = jest.fn()

module.exports = { Client, Connection, Pool }
