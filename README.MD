#Brandwatch Wordcloud Example

For the time being, just run this:

    $ npm install

and then:

    $ node server.js

and then visit http://localhost:3000/ to make your wildest dreams come true.

##Build

To build the project, clone the whole repo and make sure you have the command line tools for both Mocha and Gulp (npm install -g mocha && npm install -g gulp), then simply run the gulp command. That will take care of getting everything built and will also watch the js and scss files for changes to kick off a new build.

I'm including the compiled versions in this repo so a build is not necessary to display the root page.

For simplicity, everything runs by just running the following in the command line:

    $ gulp

Usually more time would be spend to separate tasks and to create different build goals based on the situation.

##Choices made so far / goals

* Bootstrap is referenced but that's just to add a bit of default styling. It can be removed with no impact whatsoever.
* Plugin will be standalone and compiled down to it's most lightweight form.
* No dependencies to run in front end.
* No jQuery.
* Server purely acts as a method of serving files and providing a json endpoint, nothing more. Everything else is frontend.
* Gulp is used to build the bundled js and scss. This is purely a build step and nothing outside of the /public folder required for usual usage.
* Gulp, browserify mocha and assert, for the build because they're all pretty nice and a little bit quicker and more lightweight than things like require and grunt.
* Offload as much as possible to quick css as opposed to costly javascript RE: presentation. This has been done with the info popup as there's no real point going to massive lengths in js when a simple class toggle will suffice.
