const readLine = require('readline-sync')

function userInput(content) {
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    content.lang = askAndReturnLanguage()

    function askAndReturnSearchTerm() {
        return readLine.question('Type a Search Term: ')
    }
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The History of']
        const selectedPrefixIndex = readLine.keyInSelect(prefixes, 'Choose a prefix: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }
    function askAndReturnLanguage() {
        const language = ['pt', 'en', 'jp', 'fr']
        const selectedLangIndex = readLine.keyInSelect(language, 'Choose a Language: ')
        const selectedLangText = language[selectedLangIndex]

        return selectedLangText
    }

    console.log(JSON.stringify(content, null, 4))
}

module.exports = userInput