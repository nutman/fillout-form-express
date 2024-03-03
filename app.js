require('dotenv').config()
const express = require('express');
const {fetchResponses, filterResponses} = require("./services/fillout.service");

const app = express();
const PORT = 3000;

// Define default endpoint to accept request
app.get('', async (req, res) => {
  try {
    const {filters} = req.query;

    // remove filters from query to proceed further with query for Fillout API as is
    delete req.query.filters;

    // Make the axios request with query parameters
    const response = await fetchResponses(process.env.FORM_ID, req.query);

    // If filters are empty then send data as is
    if (!filters || !filters.length || !Array.isArray(response.data.responses)) {
      return res.json(response.data);
    }

    // replace responses part in the response according to filter
    // there was a mention to handle pagination, so I decided just to keep numbers
    // recalculation of the pagination is quite tricky and can have pitfalls
    return res.json({...response.data, responses: filterResponses(response.data.responses, filters)});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({error: 'Failed to fetch data from the third-party API'});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
