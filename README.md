# Big Mouse

Big Mouse is a small UI library aimed to extend the mouse capabilities by bringing big data right into the mouse cursor with useful and beautiful visualizations.
    
This is a experimental technology under development. Please, check a demo [here](https://big-mouse.github.io/examples) for getting a first impression about it.

## Do you like Cheese ?

If you liked what you tasted, go ahead and set it up as first step before starting to use it. We use `npm` in order to download and install it, but if this best fits a npm-free installation for you, then go to our [releases](https://github.com/big-mouse/core/releases) page and download it directly from there.

```bash
npm install big-mouse
```

## Cheeses (aka Plugins)

Big Mouse is built with scalability in mind, so it becomes required to download some cheeses before you can actually enjoy it ;)

Currently there's just a single cheese plugin available, mostly built for demonstration purposes. Please, address [here](https://github.com/big-mouse/particles) for further information about how to get started with it.

## Eating The Cheeses

Got your cheese? Yeah, so now your big mouse is hungry, let's feed him!

If using `npm`, just import this, otherwise, both your big mouse and your cheeses will be available globally once imported into your html document using `script` tags.

```js
// using npm (CommonJS)
import BigMouse form 'big-mouse';
import BigMouseParticles from 'big-mouse-particles';
```

```js
// using script tags
window.BigMouse
window.BigMouseParticles
```

We'd like to train our big mouse to discover all hideouts within the JavaScript harborage, so please, let us know if needing support for a different loader.

If you get so far, congrats!, half of the way is gone. You got the mouse and the cheese. It just remains to feed it, and do not forget to keep some small piece for you too.

```js
BigMouse.cheese({

    // Ask for cheeses you love
    "cheeses": {"particles": BigMouseParticles()},
    // Limit the amout, don't abuse
    "portions": "a",
    // Arrange the mouse harborage!
    "harborage": (mouse, cheese) => {
    
        switch(mouse.href){
        
            case "...": cheese("particles", {size: 10, number: 50}); break;
            default: cheese();
        }
    }
});

BigMouse.feed();

// Disable it at will
// BigMouse.trap();

```

tired of this funky freak cheese/mouse argot ? no worries. Below the solution for non cheese/mouse fans.

```js
BigMouse.configure({

    // Declare plugins to use
    "plugins": {"particles": BigMouseParticles()}, 
    // What elements you want to pick up, defaults to all
    "selector": "a",
    // Run every time an element is found and calls the plugin to render
    "draw": (element, done) => {
    
        switch(element.href){
        
            case "...": done("particles", {size: 10, number: 50}); break;
            default: done();
        }
    }
});

BigMouse.enable();

// Disable it at will
// BigMouse.disable();
 
```

Great, job done();

## Contribute

Become a cheese maker/tester, the options are endless, vegan cheese, roquefort, mozzarella, cheddar, manchego ...

We need you, please, join us.

##  Author

Made with ♡ by Zuri Pabón 

Unlicensed.