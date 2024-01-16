const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

    reverseDict(dict) {
        const entries = Object.entries(dict);
        const reverseDict = entries.reduce((accumulator, [key, value]) => {
            accumulator[value] = key;
            return accumulator;
        }, {});

        return reverseDict;
    }

    tokenize(text) {
        return text.match(/\b(?:\d{1,2}:\d{2}|\w+('\w+)?)\b/g) || [];
    }
    tokenizeWithPunctuation(text) {
        return text.match(/\b(?:\w+('\w+)?|\w+),?|[^\w\s.]/g) || [];
    }


    getAmericanTranslation(initialText) {
        const combineData = {...americanOnly, ...americanToBritishSpelling};
        const titleData = {...this.reverseDict(americanToBritishTitles)};
        const words = this.tokenize(initialText);
        const wordsWithPunc = this.tokenizeWithPunctuation(initialText);
        let translatedText = "";
        let punctuation = '';

        if (initialText.match(/\W$/)) {
            punctuation = initialText.match(/\W$/)[0];
        }

        for (let index = 0; index < words.length; index++) {
            const word = words[index];
            const wordWithPunc = wordsWithPunc[index];
            const twoWords = `${word} ${words[index + 1]}`;
            const threeWords = `${word} ${words[index + 1]} ${words[index + 2]}`;
            let virgule = '';

            if (wordWithPunc.match(/,$/)) {
                virgule = ','
            }

            if (combineData[threeWords.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[threeWords.toLowerCase()]}</span>` + " ";
                index += 2;
            }else if (combineData[twoWords.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[twoWords.toLowerCase()]}</span>` + " ";
                index += 1;
            }else if (combineData[word.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[word.toLowerCase()]}</span>` + " ";
            }else if (titleData[word.toLowerCase()]) {
                translatedText += `<span class="highlight">${word}</span>` + " ";
            }else if (word.match(/:/)) {
                translatedText += `<span class="highlight">${word.replace(/:/, '.')}</span>` + " ";
            }
            
            else {
                translatedText += word + virgule + " ";
                virgule = false;
            }

        }
        return translatedText.trim() + punctuation;
    }

    tokenizeBritish(text) {
        return text.match(/\b(?:\d{1,2}[:.]\d{2}|\w+('\w+)?)\b/g) || [];
    }

    getBritishTranslation(initialText) {
        const combineData = {...britishOnly, ...this.reverseDict(americanToBritishSpelling)};
        const titleData = {...this.reverseDict(americanToBritishTitles)};
        const words = this.tokenizeBritish(initialText);
        const wordsWithPunc = this.tokenizeWithPunctuation(initialText);
        let translatedText = "";
        let punctuation = '';

        if (initialText.match(/\W$/)) {
            punctuation = initialText.match(/\W$/)[0];
        }

        for (let index = 0; index < words.length; index++) {
            const word = words[index];
            const wordWithPunc = wordsWithPunc[index];
            const twoWords = `${word} ${words[index + 1]}`;
            const threeWords = `${word} ${words[index + 1]} ${words[index + 2]}`;
            let virgule = '';

            if (wordWithPunc.match(/,$/)) {
                virgule = ','
            }

            if (combineData[threeWords.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[threeWords.toLowerCase()]}</span>` + " ";
                index += 2;
            }else if (combineData[twoWords.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[twoWords.toLowerCase()]}</span>` + " ";
                index += 1;
            }else if (combineData[word.toLowerCase()]) {
                translatedText += `<span class="highlight">${combineData[word.toLowerCase()]}</span>` + " ";
            }else if (titleData[word.toLowerCase()]) {
                translatedText += `<span class="highlight">${word}.</span>` + " ";
            }else if (word.match(/\b\d{1,2}[.]\d{2}\b/)) {
                translatedText += `<span class="highlight">${word.replace(/\./, ':')}</span>` + " ";
            }
            
            else {
                translatedText += word + virgule + " ";
                virgule = false;
            }

        }
        return translatedText.trim() + punctuation;
    }  
}

module.exports = Translator;