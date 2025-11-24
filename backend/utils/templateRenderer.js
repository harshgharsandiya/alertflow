function renderTemplate(content, variables = {}) {
    return content.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match
    })
}

module.exports = { renderTemplate }
