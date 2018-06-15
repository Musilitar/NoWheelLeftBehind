# NoWheelLeftBehind

Customize your car and leave no wheel behind!

# Requirements

Create an app in which you can customize a car, with the following specifications:

-   Use a full setup including build tools (any will do)
-   No images allowed (which also means no SVG or Canvas)
-   Use the latest ES versions
-   Include some form of state management. Think of this app like it is part of a much bigger application, so consider the architecture and scalability wisely
-   Use this REST API (https://car-api.firebaseio.com/rest.json) to load branding data and be able to show them on the car
-   Follow the best practices of the web (semantic HTML, assets conform to the HTTP version, ...)
-   Make it responsive

# Technology

In my meeting with Jens we talked about fundamentals, where we both agreed they are important.
With that in mind I decided to create this project using only pure JavaScript, SCSS and HTML.
It didn't seem complicated/large enough to warrant using a framework or libraries.

# Thoughts

Since I recently fell in love with functional programming, I tried to apply some of their core concepts to this project:

-   Immutable data, which is kind of hard in JavaScript because an array or an object that is declared as const can still be modified.
-   Pure functions, which is of course nearly impossible, so I just tried to limit side effects and only do them from one place.

I also really like Elm, so I decided to try and mimick the structure of an Elm application.
In that structure there is an immutable model, that gets updated by update functions, which get triggered by messages being sent from the view and where the view is just an up to date representation of the model.

Limiting or eliminating runtime errors is another goal of mine, so I programmed quite defensively.
Some might call it overkill, I would say it is still quite vulnerable.

# Decisions

I decided to preload the images from the car API.
There of course many reasons not to preload them (such as saving bandwidth), but in this case I preferred the user not having to wait when he actually wants to use them.
