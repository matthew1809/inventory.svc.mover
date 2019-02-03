const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints : ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'inventory'});
const bus = require('servicebus').bus();
const retry = require('servicebus-retry');
const { createInventory } = require('./createInventory');

bus.use(retry({
    store: new retry.MemoryStore()
}));

bus.subscribe('inventory.create', {ack: true}, async event => {
    const createInventoryResult = await createInventory(client)(event);
    
    if(!createInventoryResult[0])
        return event.handle.reject;

    return event.handle.ack;
  });