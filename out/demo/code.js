(function() {
  var CoffeeScript, Js2coffee, coffeeMode, coffeeModeInstance, editor, editors, key, performQuery, queryEngine, _i, _len, _ref;

  CoffeeScript = window.CoffeeScript;

  queryEngine = window.queryEngine;

  Js2coffee = window.Js2coffee;

  editors = window.editors = {};

  coffeeMode = require('ace/mode/coffee').Mode;

  coffeeModeInstance = new coffeeMode();

  $(window).resize(function() {
    var padHeight, padWidth;
    padWidth = $(window).width() / 2 - 20;
    padHeight = $(window).height() - $('.header:first').height() - 80;
    return $('.pad,.editor').width(padWidth).height(padHeight);
  }).trigger('resize');

  _ref = ['code', 'result'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    editor = ace.edit(key);
    editor.setTheme('ace/theme/textmate');
    editor.setShowPrintMargin(false);
    editor.getSession().setMode(coffeeModeInstance);
    editor.setHighlightActiveLine(true);
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(false);
    editors[key] = editor;
  }

  performQuery = function() {
    var code, errMessage, inCollection, resultCoffee, resultCollection;
    try {
      code = CoffeeScript.compile(editors.code.getSession().getValue());
      inCollection = eval(code);
      resultCollection = queryEngine.createCollection(inCollection);
      resultCoffee = Js2coffee.build('var result = ' + JSON.stringify(resultCollection));
      return editors.result.getSession().setValue(resultCoffee);
    } catch (err) {
      errMessage = err.toString();
      console.log(err);
      return editors.result.getSession().setValue(errMessage);
    }
  };

  editors.code.getSession().on('change', performQuery);

  editors.code.getSession().setValue("# Create a simple array of all our models\nmodels = [\n        id: 'index'\n        title: 'Index Page'\n        content: 'this is the index page'\n        tags: []\n        position: 1\n        category: 1\n    ,\n        id: 'jquery'\n        title: 'jQuery'\n        content: 'this is about jQuery'\n        tags: ['jquery']\n        position: 2\n        category: 1\n    ,\n        id: 'history'\n        title: 'History.js'\n        content: 'this is about History.js'\n        tags: ['jquery','html5','history']\n        position: 3\n        category: 1\n]\n\n\n# Perform a query to find only the items that have the tag \"jquery\"\nif true\n    result = queryEngine.createCollection(models)\n        .findAll({\n            tags:\n                $has: ['jquery']\n        })\n        .toJSON()\n\n# Perform the same query, but as a live collection\nelse if true\n    result = queryEngine.createLiveCollection()\n        .setQuery('only jquery related', {\n            tags:\n                $has: ['jquery']\n        })\n        .add(models)\n        .toJSON()\n\n# Perform a wildcard search\nelse if true\n    result = queryEngine.createLiveCollection()\n        .setFilter('search', (model,searchString) ->\n            searchRegex = queryEngine.createSafeRegex(searchString)\n            pass = searchRegex.test(model.get('title')) or searchRegex.test(model.get('content'))\n            return pass\n        )\n        .setSearchString('about') # try it with \"this\", or \"the\" as well :)\n        .add(models)\n        .toJSON()\n\n# Perform a pill search\nelse if true\n    result = queryEngine.createLiveCollection()\n        .setPill('id', {\n            prefixes: ['id:','#']\n            callback: (model,value) ->\n                pillRegex = queryEngine.createSafeRegex value\n                pass = pillRegex.test(model.get('id'))\n                return pass\n        })\n        .setSearchString('id:index') # try it with \"#index\" too!\n        .add(models)\n        .toJSON()\n\n# Otherwise return everything\nelse\n    result = []\n\n# Return our result\nreturn result");

}).call(this);
