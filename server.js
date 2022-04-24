const express = require('express')
const elasticClient = require('./elastic')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function handleError(res, error) {
	const statusCode = error.statusCode || error.code || 500
	return res.status(statusCode).json({ msg: error.message || "Server error" })
}

app.get('/', (req, res) => {
	res.status(200).json({ msg: 'working...' })
})

app.post('/create-index', async (req, res) => {
	const { index, data: documentData } = req.body
	try {
		const data = await elasticClient.index({
			index,
			document: documentData
		})
		return res.status(200).json(data)
	} catch (error) {
		return handleError(res, error)
	}
})

app.delete('/delete-show', async (req, res) => {
	try {
		const { index, id } = req.body
		if (!id) throw new Error('Id is required to delete the show')
		if (!index) throw new Error('Index is required to delete the show')
		const data = await elasticClient.delete({
			index,
			id
		})
		return res.status(200).json(data)
	} catch (error) {
		return handleError(res, error)
	}
})

app.put('/update-show', async (req, res) => {
	const { index, data: documentData, id } = req.body
	try {
		const data = await elasticClient.update({
			id,
			index,
			doc: documentData,
			_source_includes: ["showName", "genre"]
		},
		)
		return res.status(200).json(data)
	} catch (error) {
		return handleError(res, error)
	}
})

app.get('/search', async (req, res) => {
	try {
		const { index, searchQuery, searchParam } = req.query
		const match = {
			[searchParam]: searchQuery
		}

		const data = await elasticClient.search({
			index,
			query: {
				match
			},
			_source_includes: ['showName', 'genre']
		})
		return res.status(200).json(data.hits.hits)
	}
	catch (error) {
		return handleError(res, error)
	}
})

app.use((req, res) => {
	return res.status(404).json({ msg: 'not found' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`running @ ${PORT}`));
