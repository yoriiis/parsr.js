![parsr.js](https://img.shields.io/badge/parsr.js-v1.0.0-000000.svg?style=flat-square)

# [parsR.js](http://yoriiis.github.io/parsr.js)

Parsr allow you to automatically load and instanciate <a href="http://requirejs.org" target="_blank" title="More information on requireJS">requireJS</a> module by data attribute in DOM. You no longer need to check in Javascript what is the current page, to instanciate the good module. Just call `start()` method and Parsr does all the work for you.<br />

## Installation

Download the project or if you'd like to use [bower](http://bower.io), it's as easy as:

```sh
bower install parsr.js --save
```

Call parsr in your HTML before your application and use it.

```html
<script src="js/parsr.js"></script>
```

## How it work

### Dependencies

Parsr is compatible with <a href="http://requirejs.org" target="_blank" title="More information on requireJS">requireJS</a> module and use <a href="http://jquery.com" target="_blank" title="More information on jQuery">jQuery</a> 1.1+.

### Write your data attributes

Add data-attribute  where you want in the DOM and concatenate several modules if necessary. Order is important, because it is the order of loading and instancation modules.


```html
<div id="container" data-modules="components/analytics,commons">
    <header id="header" data-modules="components/header"></header>
</div>
```

### Instanciation

On Parsr instanciated, you can specify multiple options.<br />
If your application is a single page, you need to destroy all current modules before load the next page. Parsr save all modules loaded and allow you to protect specific module which should not be deleted, for example tracking module.

```javascript
var myParsr = new Parsr({
    dataAttribute: 'data-modules',
    modulesToPreserve: ['components/analytics'],
    nameMethodInit: 'init',
    removeAttribute: true,
    debug: true
});
```

### Options

* `dataAttribute` specify what data-attribute you want to use
* `modulesToPreserve` array to list all protected modules, to not destroy
* `nameMethodInit` name of the function to call when the module is loaded
* `nameMethodDestroy` name of the function to call when the module is destroyed
* `removeAttribute` clean the DOM by removing the data-attribute after init
* `debug` enable log in Javascript console

`nameMethodInit` must be the same name for all modules to load.
`nameMethodDestroy` must be the same name for all modules to destroy.

### Start all modules

Start the Parsr to execute all your modules.

```javascript
myParsr.start();
```

The function accept an optionnal parameter, a callback, excecute after all modules loaded. If `init()` method is not available in your modules you can change the name of the function in options. In case of erros Parsr will show you a warning in console and callback will still be executed.

```javascript
myParsr.start(function(){
    console.log('All modules loaded');
});
```

### Destroy all modules

If you want to protect specific modules which should not be deleted, for example tracking module, use `modulesToPreserve` array in option.

```javascript
myParsr.destroy();
```

The function accept an optionnal parameter, a callback, excecute after all modules destroyed. If `destroy()` method is not available in your modules you can change the name of the function in options. In case of erros Parsr will show you a warning in console and callback will still be executed.

```javascript
myParsr.destroy(function(){
    console.log('All modules destroy');
});
```

### List all modules to load

`listAllModulesName`  allow you to access a list of all modules to load.

```javascript
myParsr.listAllModulesName;
```

### List all modules to destroy

`listAllModulesNameToDestroy` allow you to access a list of all modules to destroy.

```javascript
myParsr.listAllModulesNameToDestroy;
```