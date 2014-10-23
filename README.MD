#Brandwatch Wordcloud Example

For the time being, just run this:

    npm install

and then:

    node server.js

and then visit http://localhost:3000/ to make your wildest dreams come true.

##Choices made so far / goals

* Plugin will be standalone and compiled down to it's most lightweight form.
* No dependencies.
* No jQuery.
* Server purely acts as a method of serving files and providing a json endpoint, nothing more. Everything else is frontend.
* Gulp is used to build the bundled js and scss. This is purely a build step and nothing outside of the /public folder required for usual usage.
* Gulp, browserify and mocha, for the build because they're all pretty nice and a little bit quicker and more lightweight than things like require and grunt.
* Offload as much as possible to quick css as opposed to costly javascript RE: presentation.
