/**
 *
 * Plugin:
 * @version 1.0.0
 *
 * @author: Joris DANIEL
 * @fileoverview: Parsr allow you to automatically load and instanciate requireJS module by data attribute in DOM
 *
 * Copyright (c) 2016 Joris DANIEL
 * Licensed under the MIT license
 *
 **/
(function($, _window){

    'use strict';

    var Parsr = function( options ){

        this.listAllModulesName = [];

        //Extend options
        this.options = $.extend({
            dataAttribute: 'data-modules',
            modulesToPreserve: [],
            nameMethodInit: 'init',
            nameMethodDestroy: 'destroy',
            removeAttribute: true,
            debug: true
        }, options || {});

        //Parse the DOM, load modules and call init method
        this.start = function(callback){

            var _this = this;

            //Parse the DOM to search all modules
            this.listAllModulesName = this.parseDOM();

            //Keep preserved modules (clone list of all modules in new array to prevent object references)
            this.listAllModulesNameToDestroy = this.keepPreservedModules(this.listAllModulesName.slice(0));

            for( var i = 0, lengthModules = this.listAllModulesName.length; i < lengthModules; i++ ){
                //Load module one by one, and call callback function on the end
                this.loadModule(this.listAllModulesName[i], i, lengthModules, callback);
            }

        };

        this.destroy = function(callback){

            var _this = this,
                lengthModules = this.listAllModulesNameToDestroy.length;

            for( var i = lengthModules-1; i >= 0; i-- ){
                //Destroy module one by one, and call callback function on the end
                this.destroyModule(this.listAllModulesNameToDestroy[i], i, lengthModules, callback);
            }

        };

    };

    Parsr.prototype.parseDOM = function(){

        var _this = this,
            listAllModulesName = [];

        //Parse DOM to search data-attribute option
        $('html').find('[' + this.options.dataAttribute + ']').each(function() {

            var $this = $(this),
                modulesRecovered = $this.attr(_this.options.dataAttribute).replace(' ', '').split(','),
                lengthModules = modulesRecovered.length,
                counter = 0,
                moduleName = null,
                moduleInstance = null;

            //Loop on all modules retrieve
            for( var i = 0; i < lengthModules; i++ ){

                moduleName = modulesRecovered[i];
                if( moduleName !== '' ){

                    //Prevent multiple instance in the same page (use method once per page)
                    if( listAllModulesName.indexOf(moduleName) === -1 ){

                        //Push new module in array
                        listAllModulesName.push(moduleName);

                    }

                }
            }

            //Remove data-attributes to clean DOM if option is enabled
            if( _this.options.removeAttribute ){
                $(this).removeAttr(_this.options.dataAttribute);
            }

        });

        return listAllModulesName;

    };

    Parsr.prototype.keepPreservedModules = function(listAllModulesName){

        var lengthModulesToDestroy = listAllModulesName.length,
            lengthModulesToPreserve = this.options.modulesToPreserve.length;

        //Loop on modules to destroy and modules to keep to return the correct list
        for( var j = lengthModulesToDestroy-1; j >= 0; j-- ){
            for( var k = 0; k < lengthModulesToPreserve; k++ ){
                if( listAllModulesName[j] === this.options.modulesToPreserve[k] ){
                    listAllModulesName.splice(j, 1);
                }
            }
        }

        return listAllModulesName;

    };

    Parsr.prototype.loadModule = function(moduleName, index, total, callback){

        var _this = this;

        //Load current module
        var moduleInstance = require([moduleName], function(mod){

            //Prevent method doesn't exist
            if( typeof mod[_this.options.nameMethodInit] === 'function' ){

                //Call specific method on module loaded
                mod[_this.options.nameMethodInit]();

                //Log if debug is enabled and load finished
                if( _this.options.debug ){
                    console.log(moduleName + ' :: init');
                }

            }else{
                //Method doesn't exist, log warning
                console.warn('Parsr :: module "' + moduleName + '" has no method ' + _this.options.nameMethodInit + '(). Please use the same name method on all your modules with "nameMethodInit" option.');
            }

            //If parsr detect callback, call the function
            if ( index === total-1 && typeof callback === 'function') {
                callback();
            }

        });

    };

    Parsr.prototype.destroyModule = function(moduleName, index, total, callback){

        var _this = this;

        //Load current module
        var moduleInstance = require([moduleName], function(mod){

            //Prevent method doesn't exist
            if( typeof mod[_this.options.nameMethodDestroy] === 'function' ){

                //Call specific method on module loaded
                mod[_this.options.nameMethodDestroy]();

                //Log if debug is enabled and load finished
                if( _this.options.debug ){
                    console.log(moduleName + ' :: destroy');
                }

            }else{
                //Method doesn't exist, log warning
                console.warn('Parsr :: module "' + moduleName + '" has no method ' + _this.options.nameMethodDestroy + '(). Please use the same name method on all your modules with "nameMethodDestroy" option.');
            }

            //If parsr detect callback, call the function
            if ( index === 0 && typeof callback === 'function') {
                callback();
            }

        });

    };

    _window.Parsr = Parsr;

})(jQuery, window);