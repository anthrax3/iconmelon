// Generated by CoffeeScript 1.6.2
(function() {
  var Budget, BudgetSchema, DB_STR, Filter, FilterSchema, Main, Promise, Secret, SecretSchema, Section, SectionSchema, app, che, cookies, express, folder, fs, http, io, jade, main, markdown, md5, mkdirp, mongo, path, port, pretty, zip, _;

  express = require('express');

  http = require('http');

  fs = require('fs');

  mongo = require('mongoose');

  path = require('path');

  che = require('cheerio');

  Promise = require('node-promise').Promise;

  _ = require('lodash');

  zip = require('node-native-zip');

  md5 = require('MD5');

  mkdirp = require('mkdirp');

  jade = require('jade');

  cookies = require('cookies');

  markdown = require('node-markdown').Markdown;

  pretty = require('pretty-data').pd;

  mkdirp('frontend/generated-icons', function() {});

  mkdirp('uploads', function() {});

  port = 3000;

  app = express();

  folder = 'frontend';

  app.set('port', process.env.PORT || port);

  app.use(express.favicon(__dirname + ("/" + folder + "/favicon.ico")));

  app.use(express["static"](__dirname + ("/" + folder)));

  app.use(express.bodyParser({
    uploadDir: 'uploads'
  }));

  app.use(express.methodOverride());

  DB_STR = process.env.NODE_ENV === 'production' ? 'mongodb://nodejitsu:d888e7ec238ea03b04322c8bdf6e2a23@paulo.mongohq.com:10007/nodejitsudb5316778635' : 'mongodb://localhost/iconmelon';

  mongo.connect(DB_STR);

  SectionSchema = new mongo.Schema({
    name: String,
    author: String,
    license: String,
    email: String,
    website: String,
    isMulticolor: Boolean,
    icons: Array,
    moderated: Boolean
  });

  SectionSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  SectionSchema.set('toJSON', {
    virtuals: true
  });

  Section = mongo.model('Section', SectionSchema);

  FilterSchema = new mongo.Schema({
    name: String,
    author: String,
    email: String,
    hash: String,
    filter: String,
    moderated: Boolean
  });

  Filter = mongo.model('Filter', FilterSchema);

  BudgetSchema = new mongo.Schema({
    budget: String,
    monthly: String
  });

  Budget = mongo.model('Budget', BudgetSchema);

  SecretSchema = new mongo.Schema({
    hash: String
  });

  Secret = mongo.model('Secret', SecretSchema);

  io = require('socket.io').listen(app.listen(process.env.PORT || port), {
    log: false
  });

  Main = (function() {
    Main.prototype.SVG_PATH = 'frontend/css/';

    function Main(o) {
      this.o = o != null ? o : {};
      this.licensesLinks = {
        'MIT': 'http://opensource.org/licenses/MIT',
        'GPL-v3': 'http://www.gnu.org/licenses/gpl-3.0.html',
        'GPL-v2': 'http://www.gnu.org/licenses/gpl-2.0.html',
        'GPL-v1': 'http://www.gnu.org/licenses/gpl-1.0.html',
        'CC by 3.0': 'http://creativecommons.org/licenses/by/3.0/',
        'BSD': 'http://opensource.org/licenses/BSD-3-Clause'
      };
    }

    Main.prototype.generateMainPageSvg = function() {
      var prm,
        _this = this;

      prm = new Promise();
      this.getIconsData({
        moderated: true
      }).then(function(iconsData) {
        return _this.makeMainSvgFile(iconsData).then(function(data) {
          return _this.writeFile("" + _this.SVG_PATH + "icons-main-page.svg", data).then(function() {
            return prm.resolve();
          });
        });
      });
      return prm;
    };

    Main.prototype.writeFile = function(filename, data) {
      var prm;

      prm = new Promise();
      fs.writeFile(filename, data, function(err) {
        err && (console.error(err));
        return prm.resolve();
      });
      return prm;
    };

    Main.prototype.makeMainSvgFile = function(iconsData, filename) {
      var prm;

      prm = new Promise();
      fs.readFile("" + this.SVG_PATH + "icons.svg", {
        encoding: 'utf8'
      }, function(err, data) {
        data = data.replace(/\<\/svg\>/gi, '');
        data = "" + data + iconsData + "</svg>";
        return prm.resolve(data);
      });
      return prm;
    };

    Main.prototype.getIconsData = function(search) {
      var prm;

      prm = new Promise();
      Section.find(search, function(err, docs) {
        var doc, i, icon, iconData, j, str, _i, _j, _len, _len1, _ref;

        iconData = '';
        for (i = _i = 0, _len = docs.length; _i < _len; i = ++_i) {
          doc = docs[i];
          _ref = doc.icons;
          for (j = _j = 0, _len1 = _ref.length; _j < _len1; j = ++_j) {
            icon = _ref[j];
            str = "<g id='" + icon.hash + "'>" + icon.shape + "</g>";
            str = !doc.isMulticolor ? str.replace(/fill=\"\s?#[0-9A-Fa-f]{3,6}\s?\"/gi, '') : str;
            iconData += str;
          }
        }
        return Filter.find(search, function(err, docs) {
          var _k, _len2;

          for (i = _k = 0, _len2 = docs.length; _k < _len2; i = ++_k) {
            doc = docs[i];
            iconData += doc.filter.replace(/\<filter/, "<filter id='" + doc.hash + "' ");
          }
          return prm.resolve(iconData);
        });
      });
      return prm;
    };

    Main.prototype.generateProductionIcons = function(data) {
      var prm,
        _this = this;

      this.iconNames = [];
      prm = new Promise();
      data = this.restructData(data);
      this.generateProductionSvgData(data).then(function(xmlData) {
        return _this.makeProductionHtmlFile(xmlData).then(function(htmlData) {
          return _this.makeProductionSvgFile(xmlData.svgData).then(function(svgData) {
            return _this.makeZipFireball({
              htmlData: htmlData,
              svgData: svgData,
              licenseData: xmlData.licenseData
            }).then(function(archive) {
              return prm.resolve(archive);
            });
          });
        });
      });
      return prm;
    };

    Main.prototype.makeZipFireball = function(data) {
      var SYSTEM_FILES, archive, prm;

      prm = new Promise();
      archive = new zip;
      archive.add('icons.svg', new Buffer(pretty.xml(data.svgData), 'utf8'));
      archive.add('index.html', new Buffer(pretty.xml(data.htmlData), 'utf8'));
      archive.add('license.md', new Buffer(data.licenseData, 'utf8'));
      SYSTEM_FILES = 'you-dont-need-this-assets-folder';
      archive.addFiles([
        {
          name: "" + SYSTEM_FILES + "/main.css",
          path: 'frontend/download/css/main.css'
        }, {
          name: "" + SYSTEM_FILES + "/favicon.ico",
          path: 'frontend/download/css/favicon.ico'
        }, {
          name: "" + SYSTEM_FILES + "/main-logo.svg",
          path: 'frontend/download/css/main-logo.svg'
        }, {
          name: 'icons.css',
          path: 'frontend/download/icons.css'
        }
      ], function(err) {
        var fileName;

        if (err) {
          return console.log("err while adding files", err);
        }
        fileName = "iconmelon-" + (md5(new Date + (new Date).getMilliseconds() + Math.random(9999999999999) + Math.random(9999999999999) + Math.random(9999999999999)));
        return fs.writeFile("frontend/generated-icons/" + fileName + ".zip", archive.toBuffer(), function(err) {
          return prm.resolve(fileName);
        });
      });
      return prm;
    };

    Main.prototype.makeProductionHtmlFile = function(xmlData) {
      var prm;

      prm = new Promise();
      fs.readFile("frontend/download/kit.html", {
        encoding: 'utf8'
      }, function(err, data) {
        data = data.replace(/\<\!-- svg-icons-place --\>/gi, xmlData.svgData);
        data = data.replace(/\<\!-- icons-place --\>/gi, xmlData.htmlData);
        return prm.resolve(data);
      });
      return prm;
    };

    Main.prototype.makeProductionSvgFile = function(svgData) {
      var prm;

      prm = new Promise();
      fs.readFile("frontend/download/icons-template.svg", {
        encoding: 'utf8'
      }, function(err, data) {
        data = data.replace(/\<\/svg\>/gi, '');
        data = "" + data + svgData + "</svg>";
        return prm.resolve(data);
      });
      return prm;
    };

    Main.prototype.addAuthor = function(doc) {
      var _ref;

      if ((_ref = this.licenses) == null) {
        this.licenses = [];
      }
      if (_.indexOf(this.licenses, doc.license) === -1) {
        this.licenses.push(doc.license);
      }
      return "" + ((new Date).getFullYear()) + " " + doc.author + " " + doc.email + " " + (doc.website || '') + " \n" + doc.license + " " + this.licensesLinks[doc.license] + " \n\n";
    };

    Main.prototype.makeLicense = function(data) {
      var i, license, licenses, _i, _len, _ref;

      licenses = '';
      _ref = this.licenses;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        license = _ref[i];
        licenses += "\n\n" + (fs.readFileSync("views/licenses/" + license + ".md").toString());
      }
      return data += "" + licenses;
    };

    Main.prototype.generateProductionSvgData = function(data) {
      var firstIcon, htmlData, htmlIcon, licenseData, prm, svgData,
        _this = this;

      prm = new Promise();
      svgData = '';
      htmlData = jade.renderFile('views/header.jade', {
        name: 'Icons'
      });
      licenseData = '';
      htmlIcon = '';
      firstIcon = null;
      Section.find({
        name: {
          $in: data.sections
        }
      }, function(err, docs) {
        var doc, i, icon, iconDB, icons, iconsDB, j, k, name, renderData, str, _i, _j, _k, _len, _len1, _len2;

        for (i = _i = 0, _len = docs.length; _i < _len; i = ++_i) {
          doc = docs[i];
          icons = data.icons[doc.name];
          iconsDB = doc.icons;
          licenseData += _this.addAuthor(doc);
          for (j = _j = 0, _len1 = icons.length; _j < _len1; j = ++_j) {
            icon = icons[j];
            for (k = _k = 0, _len2 = iconsDB.length; _k < _len2; k = ++_k) {
              iconDB = iconsDB[k];
              if (iconDB.hash === icon) {
                name = _this.ensureUniq(_this.safeCssName(iconDB.name));
                renderData = {
                  iconDB: iconDB,
                  name: name,
                  doc: doc
                };
                str = jade.renderFile('views/g.jade', renderData);
                str = !doc.isMulticolor ? str.replace(/fill=\"\s?#[0-9A-Fa-f]{3,6}\s?\"/gi, '') : str;
                htmlIcon = jade.renderFile('views/icon.jade', {
                  data: {
                    name: name
                  }
                });
                htmlData += htmlIcon;
                if (firstIcon == null) {
                  firstIcon = htmlIcon;
                }
                svgData += str;
              }
            }
          }
        }
        htmlData += '</div>';
        licenseData = _this.makeLicense(licenseData);
        if (!data.filters) {
          prm.resolve({
            svgData: svgData,
            htmlData: htmlData,
            licenseData: licenseData
          });
          return;
        }
        return Filter.find({
          hash: {
            $in: data.filters
          }
        }, function(err, docs) {
          var filterName, _l, _len3;

          htmlData += jade.renderFile('views/header.jade', {
            name: 'Filters'
          });
          for (i = _l = 0, _len3 = docs.length; _l < _len3; i = ++_l) {
            doc = docs[i];
            filterName = _this.safeCssName(doc.name);
            str = doc.filter.replace(/\<filter\s?/, "<filter id='" + filterName + "' data-iconmelon='filter:" + doc.hash + "' ");
            svgData += str;
            data = {
              filter: filterName,
              name: name,
              viewBox: '0 0 34 34'
            };
            htmlData += jade.renderFile('views/icon.jade', {
              data: data
            });
          }
          return prm.resolve({
            svgData: svgData,
            htmlData: htmlData += '</div>',
            licenseData: licenseData
          });
        });
      });
      return prm;
    };

    Main.prototype.safeCssName = function(name) {
      return name.replace(/[^|\d|\w|\-]/gi, '-');
    };

    Main.prototype.ensureUniq = function(name) {
      var lastDigit;

      if (_.indexOf(this.iconNames, name) === -1) {
        this.iconNames.push(name);
        return name;
      } else {
        lastDigit = parseInt(name.match(/\d$/), 10);
        name = !lastDigit ? "" + name + "1" : name.replace(/\d$/, ++lastDigit);
        return this.ensureUniq(name);
      }
    };

    Main.prototype.restructData = function(data) {
      var i, icon, icons, sections, _i, _len, _ref;

      icons = {};
      sections = [];
      _ref = data.icons;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        icon = _ref[i];
        icon = icon.split(':');
        if (icons[icon[0]] == null) {
          icons[icon[0]] = [];
          sections.push(icon[0]);
        }
        icons[icon[0]].push(icon[1]);
      }
      return {
        icons: icons,
        sections: sections,
        filters: data.filters
      };
    };

    return Main;

  })();

  main = new Main;

  io.sockets.on("connection", function(socket) {
    socket.getCookie = function(name) {
      var cookie, i, _i, _len, _ref;

      cookies = {};
      _ref = socket.handshake.headers.cookie.split(';');
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        cookie = _ref[i];
        cookie = cookie.split('=');
        cookies[cookie[0].replace(/\s/, '')] = cookie[1];
      }
      return cookies[name];
    };
    socket.on("sections:read", function(data, callback) {
      return Section.find({
        moderated: true
      }, function(err, docs) {
        return callback(null, docs);
      });
    });
    socket.on("filters:read", function(data, callback) {
      return Filter.find({
        moderated: true
      }, function(err, docs) {
        if (err) {
          callback(500, 'DB error');
          console.error(err);
        }
        return callback(null, docs);
      });
    });
    socket.on("sections-all:read", function(data, callback) {
      return Secret.find({}, function(err, docs) {
        if (docs[0].hash !== socket.getCookie('secret')) {
          callback(405, 'no, sorry');
          return;
        }
        return Section.find({}, function(err, docs) {
          return callback(null, docs);
        });
      });
    });
    socket.on("section:create", function(data, callback) {
      return Secret.find({}, function(err, docs) {
        if (docs[0].hash !== socket.getCookie('secret')) {
          callback(405, 'no, sorry');
          return;
        }
        data.moderated = false;
        return new Section(data).save(function(err) {
          if (err) {
            callback(500, 'DB error');
            return console.error(err);
          } else {
            return callback(null, 'ok');
          }
        });
      });
    });
    socket.on("section:update", function(data, callback) {
      return Secret.find({}, function(err, docs) {
        var id;

        if (docs[0].hash !== socket.getCookie('secret')) {
          callback(405, 'no, sorry');
          return;
        }
        id = data.id;
        delete data._id;
        return Section.update({
          '_id': id
        }, data, {
          upsert: true
        }, function(err) {
          var _this = this;

          return main.generateMainPageSvg().then(function() {
            if (err) {
              callback(500, 'DB error');
              return console.error(err);
            } else {
              return callback(null, 'ok');
            }
          });
        });
      });
    });
    return socket.on("section:delete", function(data, callback) {
      return Section.findById(data.id, function(err, doc) {
        if (err) {
          callback(500, 'DB error');
          console.error(err);
        } else {
          callback(null, 'ok');
        }
        return doc.remove(function(err) {
          if (err) {
            callback(500, 'fs error');
            return console.error(err);
          } else {
            return callback(null, 'ok');
          }
        });
      });
    });
  });

  app.post('/download-icons', function(req, res, next) {
    var _this = this;

    return main.generateProductionIcons(req.body).then(function(fileName) {
      return res.send(fileName);
    });
  });

  app.post('/file-upload', function(req, res, next) {
    return fs.readFile(req.files.files[0].path, {
      encoding: 'utf8'
    }, function(err, data) {
      var $;

      $ = che.load(data);
      res.send($('svg').html());
      return fs.unlink(req.files.files[0].path, function(err) {
        return err && console.error(err);
      });
    });
  });

  app.get('/generate-main-svg-data', function(req, res, next) {
    return main.generateMainPageSvg().then(function(msg) {
      return res.send(msg);
    });
  });

  app.get('/budget-counters', function(req, res, next) {
    return Budget.find({}, function(err, docs) {
      var doc;

      doc = docs[0];
      return res.send(doc);
    });
  });

}).call(this);
