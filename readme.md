# Next Slide, Please

Three words you should never have to hear again.

Hi 👋 I'm [Tyler](https://www.aTylerRobertson.com), and this is another in a long line of making things that start out as jokes, but end up as features that Google should have implemented on their own by now. Specifically, it's here to solve a problem I run into a lot: group presentations! Giving a group presentation over the internet is especially tough, because usually one person is sharing their screen, while one or more other people are doing the actual talking. This means that the people talking usually need to ask the person sharing their screen to advance the slides, so you hear "Could you go to the next slide, please?" roughly once per slide in every Zoom call. And like, that's fine if you want to live like that, but... we don't... _have_ to? There's ways around it! And that's what I'm getting at here.

This project exploits the `/preview?slide=` endpoint and query supported by Google Slides, which allows you to summon any slide from a Slides document that you have access to. With that, we can have a primary user load up a presentation, and generate a code for users who need the "remote". Then, using [Socket.io](https://socket.io), we can let those other users connect, and advance or retreat the slides on their end, giving everyone a "next slide" button who needs it. This makes for an easier experience for the presenters, and a less annoying experience for the viewers.

## To do:

- [x] display slide based on slide number
- [x] allow users to advance slide remotely
- [x] let primary insert any Google Slides presentation they own
- [x] generate a code for primary user to share with secondary users
- [x] allow secondary users to advance the slide in ONLY the presentation they have the code for
- [x] make it look nice (inside & out!)
- [x] smooth out slide loading (maybe pre-load the next slide?)
- [x] convert app to PWA
- [x] remove JQuery in favor of vanilla JS
- [x] give viewers a "Previous Slide" button
- [x] update explainer video
- [x] clean up CSS
- [x] make it easier for presenter to hide/show room info
- [x] fix choppiness caused by loading iframes separately
- [ ] find a way to stay in sync if presenter manually changes slides (i.e., with arrow keys)

## Notes: 

- To smooth transitions, the app pre-loads the next and previous slides in the background, meaning that autoplay videos and animations will start playing before the slide is actually visible.
- Clicking on the presentation itself to advance the slides, or using the arrow keys, will cause the presentation to get out of sync with the remote presenters. This may cause the app to appear as though it's not doing anything at first. Using the "Reset 🔄" button typically fixes this.