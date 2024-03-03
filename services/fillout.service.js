require('dotenv').config()
const axios = require("axios");
const {prepareUrl, prepareHeaders, applyFilters} = require("../utils/helpers");

async function fetchResponses(formId, query) {
  // Combine URL with query parameters
  const fullUrl = prepareUrl(formId, query);

  const headers = prepareHeaders(process.env.API_KEY);
  return  axios.get(fullUrl, headers);
}

function filterResponses(responses, filters) {
  // Filter data which was get from Fillout API
  return responses.filter(entry => {
    return applyFilters(entry.questions, JSON.parse(filters))
  })
}

module.exports = {
  fetchResponses: fetchResponses,
  filterResponses: filterResponses
}
