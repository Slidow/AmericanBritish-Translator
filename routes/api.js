'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;

      if (text === "") {
        res.json({ error: 'No text to translate' });
        return;
      }
      else if (!locale || !text) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      if (locale === "american-to-british") {
        let translation = translator.getAmericanTranslation(text)
        if (!translation || translation === text) {
          res.json({text, translation: "Everything looks good to me!"})
          return;
        }else {
          res.json({text, translation});
          return;
        }
      }
      else if (locale === "british-to-american") {
        let translation = translator.getBritishTranslation(text)
        if (!translation || translation === text) {
          res.json({text, translation: "Everything looks good to me!"})
          return;
        }else {
          res.json({text, translation});
          return;
        }
      }
      else {
        res.json({ error: "Invalid value for locale field" });
        return;
      }

    });
};
