const { Client } = require('@elastic/elasticsearch');
const ELASTIC_SEARCH_URL = "http://localhost:9200"
const elasticClient = new Client({
	auth: {
		username: 'elastic',
		password: '=GFO9K7VfLr=vZOdcsjv',
	},
	node: ELASTIC_SEARCH_URL,
});

module.exports = elasticClient