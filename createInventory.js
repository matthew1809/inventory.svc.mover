module.exports.createInventory = cassandraClient => async event => {
    const { id, name, description } = event;
    const params = [id, name, description];

    const query = 'INSERT INTO inventory.items (id, name, description) VALUES (?, ?, ?);';
    
    try {
        const queryResult = await cassandraClient.execute(query, params, {prepare: true});
        return [true, queryResult];
    } catch(e) {
        return [false, e];
    };
};