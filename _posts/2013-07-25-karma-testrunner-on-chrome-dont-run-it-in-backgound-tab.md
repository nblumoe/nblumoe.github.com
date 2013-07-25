---
layout: post
title: "Karma very slow on Chrome? Dont run it in backgound tab"
description: ""
category: software
tags: [testing, tools, javascript]
---
{% include JB/setup %}

Very recently I started to use the very nice [Karma Test
Runner](http://karma-runner.github.io/). I really do recommend to check
it out.

However I wondered why tests ran very slow sometimes (>20s) and
sometimes they where very fast (&lt;1s). Quickly I realized the issue was
 having the Chrome tab in the background:

The Chrome tab which was connected to Karma was one among others. I used
the other tabs for web browsing and development, so the Karma tab wasn't
the active tab. This gives it a very low priority and running tests became
extremly sluggish.

This does not happen if the tab is the active on (= you can actually see
it). To resolve the issue, simply open a new Chrome window and open the
Karma URL there to run the tests. Tests are fast again and if you want
to, just minimize this window so it gets out of the way.

Happy coding!
