const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const fs = require('fs')
const userInput = require('./user-input')

async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizedContent(content)
    breakContentIntoSentences(content)
    creatFile(content)

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            "articleName": content.searchTerm,
            "lang": content.lang
        })
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
    }
    function sanitizedContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().lenght === 0 || line.trim().startsWith('=')) {
                    return false
                } else {
                    return true
                }
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }
        function removeDatesInParentheses(text) {
            return (
                text.replace(/\((?:\([^()]*\)|[^()])*\)/gm / '', ''),
                text.replace(/  /g, ' ')
            )
        }

    }
    function breakContentIntoSentences(content) {
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }
    function creatFile(content) {
        const file = `${content.prefix} ${content.searchTerm}.txt`
        const data = content.sourceContentSanitized

        fs.writeFile(file, data, function (err) {
            if (err) throw err
            console.log('Seu arquivo foi criado com sucesso!')
        })
    }
}

module.exports = robot