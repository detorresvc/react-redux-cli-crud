#!/usr/bin/env node
var program = require('commander');
var fs = require('fs')
var Promise = require('promise')
var Mustache = require('mustache')
var path = require('path');
var _str = require('lodash/string');

var BASE_PATH = __dirname

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

program
  .arguments('<modulename>')
  .option('-d, --dirdest <dirdest>', 'The directory destination')
  .option('-s, --schema <schema>', 'Schema json file for your module')
  .option('-f, --fields <fields>', 'array of fields')
  .option('-e, --endpoint <endpoint>', 'api endpoint')
  
  .action(function(moduleName) {

  	var promise = new Promise(function(resolve, reject){


  		if (fs.existsSync(program.dirdest)) {
  			resolve(program.dirdest)
  		}
  		reject('Destination does not exist')
  	})
  	.then(function(destination){


  		var mod = destination+'/'+_str.kebabCase(moduleName);

  		fs.mkdirSync(mod)

  		if (fs.existsSync(mod)) {
  			return mod;
  		}

  	})
  	.then(function(module){
  		
  		var lowerCaseModule = module.toLowerCase()

  		var p1 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/actions')
  				resolve(module+'/actions')
  			}
  		});

  		var p2 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/components')
  				resolve(module+'/components')
  			}
  		});

  		var p3 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/containers')
  				resolve(module+'/containers')
  			}
  		});

  		var p4 = new Promise(function(resolve, reject){
  			if(fs.existsSync(module)){
  				fs.mkdir(module+'/reducers')
  				resolve(module+'/reducers')
  			}
  		});

      var p5 = new Promise(function(resolve, reject){
        if(fs.existsSync(module)){
          fs.mkdir(module+'/constants')
          resolve(module+'/constants')
        }
      });

  		return Promise.all([p1, p2, p3, p4, p5]).then(function(values) { 
		    return values
		  });

  	})
  	.then(function(folders){
        
       var mod = _str.kebabCase(moduleName)
       
       var schema = {}
       var listData = []

       if(program.fields){
          listData = program.fields.split(",").map(item => {
              return {
                dataOrig: item.trim(),
                dataStarCase: _str.startCase(item.trim()),
                dataType: item.trim()
              }
          })
      }

        if (fs.existsSync(program.schema)) {
            schema = JSON.parse(fs.readFileSync(program.schema).toString())
            listData = schema.data.map(item => {
                return {
                  dataOrig: item.field,
                  dataStarCase: _str.startCase(item.field),
                  dataType: item.type
                }
            })
        }
      
        var containerData = {
          moduleNameCamelCase: _str.camelCase(moduleName),
          moduleNameLowerCase: moduleName.toLowerCase(),
          moduleNameOrig: moduleName,
          moduleNameUpperCase: moduleName.toUpperCase(),
          moduleNameKebabCase: mod,
          moduleStartCase: _str.startCase(moduleName),
          listData: listData,
          formData: listData,
          apiEndPoint: program.endpoint || this.moduleNameLowerCase
        }
        

        if(folders.indexOf(program.dirdest+'/'+mod+'/containers') > -1){
            
            var p1 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/container.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js", output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/containers/'+containerData.moduleNameOrig+".js")){
                  resolve(program.dirdest+'/'+mod+'/containers'+containerData.moduleNameOrig+".js")
                }
                else{
                  reject('container didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+'/'+mod+'/reducers') > -1){
            
            var p2 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/reducer.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);             

                fs.writeFileSync(program.dirdest+'/'+mod+'/reducers/index.js', output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/reducers/index.js')){
                  resolve(program.dirdest+'/'+mod+'/reducers/index.js')
                }
                else{
                  reject('reducer didnt created')
                }

            });

        }


        if(folders.indexOf(program.dirdest+'/'+mod+'/actions') > -1){
            
            var p3 = new Promise(function(resolve, reject){

                var containerTemplate = fs.readFileSync(BASE_PATH+'/templates/actions.template').toString()
                    
                var output = Mustache.render(containerTemplate, containerData);  
                    
                fs.writeFileSync(program.dirdest+'/'+mod+'/actions/index.js',output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/actions/index.js')){
                  resolve(program.dirdest+'/'+mod+'/actions/index.js')
                }
                else{
                  reject('actions didnt created')
                }

            });

        }

        if(folders.indexOf(program.dirdest+'/'+mod+'/components') > -1){
            
            var p4 = new Promise(function(resolve, reject){

                var formTemplate = fs.readFileSync(BASE_PATH+'/templates/form.template').toString()
                    
                var output = Mustache.render(formTemplate, containerData);  
                    
                fs.writeFileSync(program.dirdest+'/'+mod+'/components/Form.js',output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/components/Form.js')){
                  resolve(program.dirdest+'/'+mod+'/components/Form.js')
                }
                else{
                  reject('form didnt created')
                }

            });

        }

        if(folders.indexOf(program.dirdest+'/'+mod+'/components') > -1){
            
            var p5 = new Promise(function(resolve, reject){

                var listTemplate = fs.readFileSync(BASE_PATH+'/templates/list.template').toString()
                    
                var output = Mustache.render(listTemplate, containerData);  
                    
                fs.writeFileSync(program.dirdest+'/'+mod+'/components/List.js',output);

                if(fs.existsSync(program.dirdest+'/'+mod+'/components/List.js')){
                  resolve(program.dirdest+'/'+mod+'/components/List.js')
                }
                else{
                  reject('form didnt created')
                }

            });

        }

        if(folders.indexOf(program.dirdest+'/'+mod+'/constants') > -1){

          var p6 = new Promise(function(resolve, reject){

              var constantsTemplate = fs.readFileSync(BASE_PATH+'/templates/constants.template').toString()
                  
              var output = Mustache.render(constantsTemplate, containerData); 

              fs.writeFileSync(program.dirdest+'/'+mod+'/constants/index.js', output);

              if(fs.existsSync(program.dirdest+'/'+mod+'/constants/index.js')){
                resolve(program.dirdest+'/'+mod+'/constants/index.js')
              }
              else{
                reject('constants didnt created')
              }

          });
        }

        var p7 = new Promise(function(resolve, reject){

            var routesTemplate = fs.readFileSync(BASE_PATH+'/templates/routes.template').toString()
                
            var output = Mustache.render(routesTemplate, containerData);             

            fs.writeFileSync(program.dirdest+'/'+mod+'/routes.js', output);

            if(fs.existsSync(program.dirdest+'/'+mod+'/routes.js')){
              resolve(program.dirdest+'/'+mod+'/routes.js')
            }
            else{
              reject('routes didnt created')
            }

        });

  	})
    .then(function(){
        console.log('module successfully created');
    })
  	.catch(function(err){
  		console.log(err)
  	})
 
  })
  .parse(process.argv);