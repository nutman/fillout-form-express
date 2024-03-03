const {isIsoDate} = require('./date');

function applyFilters(questions, conditions) {
  return conditions.every((condition) => {
    return questions.some((item) => {
      if (item.id !== condition.id ) return false;
      let itemValue = item.value;
      let conditionValue = condition.value;

      if (isIsoDate(itemValue) && isIsoDate(conditionValue)) {
        itemValue = new Date(itemValue);
        conditionValue = new Date(conditionValue);
      }
      switch (condition.condition) {
        case 'equals':
          return itemValue === conditionValue;
        case 'does_not_equal':
          return itemValue !== conditionValue;
        case 'greater_than':
          return itemValue > conditionValue;
        case 'less_than':
          return itemValue < conditionValue;

        default:
          return false; // If condition is not recognized, return false to remove the item
      }
    });
  });
}

function prepareUrl(formId, query) {
  const url = `https://api.fillout.com/v1/api/forms/${formId}/submissions`;
  const queryParams = new URLSearchParams(query).toString();
  return`${url}?${queryParams}`;
}

function prepareHeaders(token) {
  return {headers: {Authorization: `Bearer ${token}`}}
}

module.exports = {
  applyFilters: applyFilters,
  prepareUrl: prepareUrl,
  prepareHeaders: prepareHeaders
}
