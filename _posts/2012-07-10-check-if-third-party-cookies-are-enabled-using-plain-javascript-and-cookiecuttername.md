---
layout: post
title: "Check if third party cookies are enabled using plain Javascript and CookieCutter.name"
description: ""
category: software
tags: [javascript, cookies, security]
---
{% include JB/setup %}

Here is a quick and simple solution to check if a visitor of your
website has third party cookies enabled. It uses plain Javascript and
the service provided by [CookieCutter.name][cclink]:

[cclink]: http://cookiecutter.name/
{% highlight javascript %}
// create random token to circumvent caching
var token = Math.random().toString(36).substring(2,10);
// callback for cookie cutter script
function CookieCutter(t) {
  if (t == token) {
    alert("Your browser enabled cookies.");
  } else {
    alert("Your browser disabled cookies or third-party cookies.");
  }
}

// get cookie cutter script and pass token
var script = document.createElement('script');
script.src = "http://cookiecutter.name/Check/" + token;
var head = document.getElementsByTagName('head')[0];
head.appendChild(script);
{% endhighlight %}

We create a unique `token`, so we do not run into trouble with browser
caching. This is passed to the `CookieCutter.name` service in the last
part of the snippet.

`CookieCutter(t)` gets called by the script that we get and execute. The
parameter `t` holds the token we use when requesting the script. So we
just implement a check if it matches our random token.

`CookieCutter.name` passes the token around by using a cookie. So if the
token persist in the response we get, this means storing a cookie was
possible.

The last part of the snippet just creates a `script` DOM element with an
URL including the token and appends it to the `head` element. Thus it
gets loaded and executed.

That's it! Just put your code to perform on whether the user enabled
third party cookies or not in the `CookieCutter()` callback.
