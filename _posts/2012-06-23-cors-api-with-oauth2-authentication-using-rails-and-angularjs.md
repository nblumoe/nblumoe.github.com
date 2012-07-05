---
layout: post
title: "CORS API with Oauth2 authentication using Rails and AngularJS"
description: ""
category: software
tags: [ruby-on-rails, angularjs, API, oauth]
---
{% include JB/setup %}

## Introduction

For my latest project [PomodoroEasy][pomodoroeasy] I wanted as much
decoupling of the web client and the server as possible. So the server
only provides a RESTful JSON API to feed the client. All the templating,
views and business logic are done clientside.

[pomodoroeasy]: http://www.pomodoroeasy.com/

Furthermore I wanted them to be provided on different servers and
domains. The client is a single page webapp, which resides as a static
project on it's own server. It is not sent from the Rails API server.

The resources the API provides are user specific, so I had to implement
an authentication mechanism. This could have been done with a simple HTTP
authentication or a self made login/password solution.

I decided to implement an OAuth2 Provider in the backend service. First
of all, I wanted to gain some experience with OAuth2. But I think this
way it is a more robust and future-proof solution. Authentication is a
big security issue, so I would rather build on a proven standard.

> Attention: In this example I am using http everwhere. This is fine for
> testing purposes. But in production you must(!) use https. Otherwise
> you would send non-encrypted credentials, which is a big security
> issue.

### OAuth Authorization Flow

OAuth2 provides several authorization flows. Have a look at the [OAuth2
documentation][oauth2draft] or [this great summary][oauth2quora] on
quora.

In this example we have full control over the server and the client.
Both are our products, so it's fine to ask the user in the webapp client
for username and password directly. We are using the "[Resource Owner
Password Credentials][resourceownerdraft]" authentication flow.

If the client would be a 3rd party application you would not use this
authentication flow, but the "Implicit Grant" flow. Imagine you would
own twitter and some 3rd party would build a twitter client. The user
should not have to provide it's twitter login in the 3rd party client,
because it could easily be catched there and misused.

[oauth2draft]: http://tools.ietf.org/html/draft-ietf-oauth-v2-28
[resourceownerdraft]: http://tools.ietf.org/html/draft-ietf-oauth-v2-28#section-1.3.3
[oauth2quora]: http://www.quora.com/OAuth-2-0/How-does-OAuth-2-0-work

### Cross-origin resource sharing (CORS)

As the client and the server reside on different domains, we need to
take care of [CORS][corswiki]. You might consider using a reverse proxy
with the two servers behind it to use the same domain, but different
servers for backend and frontend. This would be an alternatice approach,
which I do not cover here.

Implementing CORS is pretty easy, we just have to set some HTTP headers.
CORS is supported by most modern web browsers.

[corswiki]: http://en.wikipedia.org/wiki/Cross-origin_resource_sharing

## Backend Implementation

### CORS

To enable CORS we have to set some HTTP headers. I did this globally in
the `ApplicationController`:

{% highlight ruby %}
class ApplicationController < ActionController::Base
  protect_from_forgery
  # do not use CSRF for CORS options
  skip_before_filter :verify_authenticity_token, :only => [:options]

  before_filter :cors_set_access_control_headers
  before_filter :authenticate_cors_user

  def authenticate_cors_user
    if request.xhr? && !user_signed_in?
      error = { :error => "You must be logged in." }
      render :json => error, :status => 401
    end
  end

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = 'http://localhost'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type'
    headers['Access-Control-Max-Age'] = "1728000"
  end

  def options 
    render :text => '', :content_type => 'text/plain'
  end
end
{% endhighlight %}

The `cors_set_access_control_headers` filter
provides the needed HTTP headers in the response from our server. In
this example we are using localhost as the foreign domain. This is the
domain, where your API consuming client resides. Have a look at the
allowed methods: There are the default HTTP verbs and additionally there
is `OPTIONS`. The latter one is used for CORS preflight requests. Check
out [this great article][corsarticle], to learn more about it.

[corsarticle]: http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/

For the OPTION method we do not want Rails to check for a CSRF token.
There are no sessions on the clientside anyways, so we really do not
need it here. We also define an `options` action, which just returns an
empty page, but with the CORS headers. The whole OPTIONS method is just
a check from the client to see if the server allows CORS for the client.

There is an additional filter called `authenticate_cors_user`. I was
hoping to get rid of it, but I wasn't till now. Why do we need this? As
you can see it sends a simple JSON 401 response, if the user is not
authenticated and did send a XHR request. Basically [Devise][devise] already does
this. The problem is, Devise does not include the CORS headers in it's
response. By using this filter instead of the Devise authentication we
send the CORS headers in the 401 response and thus can react on this in
the client.

[devise]: https://github.com/plataformatec/devise/

If you skip this filter, the client will never get the 401 response,
because the CORS headers are missing. So if you want to catch the 401,
you have to include this. I think there should be a better way of doing
this: The CORS headers should be settable via [Warden][warden]. However,
I did not manage to get this working, feel free to help me with that on
stackoverflow, [right here][stackoverflowwarden].

[stackoverflowwarden]: http://stackoverflow.com/questions/11177079/how-to-send-cors-headers-with-devise-if-user-not-authorized-401-response

[warden]: https://github.com/hassox/warden/

Finally we have to set a route in `routes.rb`. This is simple: We just have to make sure every request with the
OPTIONS method goes to the `options` action of the
`ApplicationController`:
{% highlight ruby %}
match '/*path' => 'application#options', :via => :options
{% endhighlight %}

That's it! Every response from the server will have the CORS HTTP
headers and we deal with the OPTIONS call the client will send to check
if CORS is enabled.

### OAuth2
As I am using Devise, I did use the
[devise_oauth2_providable][oauth2providablegem] gem to
integrate the OAuth2 provider with device in my Rails app.
Check out the install instructions there: Install the gem, do a database
migration, add routes and configure the User model.

[oauth2providablegem]: https://github.com/socialcast/devise_oauth2_providable

Basically that is all you have to do, to get your OAuth2 Provider based
on your user authentication with Devise. Isn't that great? However you
still have to do the authorization somehow. Just the same way you would
do it normally, with [CanCan][cancan] for example.

[cancan]: https://github.com/ryanb/cancan/

## Frontend Implementation

As we have everythin in place on the backend, let's see how to connect
to this from the clientside.
