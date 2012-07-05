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

We have to create an OAuth2 client in the databse to get access from our
client application. I put this into the database seed, but you might
want to create it dynamically or in any other way:

{% highlight ruby %}
webclient = Devise::Oauth2Providable::Client.create(
  :name => "NAME OF YOUR CLIENT",
  :redirect_uri => "REDIRECT TO THIS URL AFTER AUTH",
  :website => "WEBSITE OF THE CLIENT",
)
webclient.secret = "client-secret"
webclient.identifier ="client-id"
webclient.save
{% endhighlight %}

You can provide a name for the client. The `:redirect_uri` attribute is
not used in the authentication workflow we are using. But still you
should provide a valid URL to your client app here. The `website`
parameter is just the URL of your client app's homepage.

Finally you have to provide a unique `secret` and `identifier` for your
app. These attributes must be known and used by the client app. In the
authentication workflow we use, the `secret` does not provide additional
security, as it can be read in the client's javascript code easily.
However, we still have to provide it, to identify our client app.

Basically that is all you have to do, to get your OAuth2 Provider based
on your user authentication with Devise. Isn't that great? However you
still have to do the authorization somehow. Just the same way you would
do it normally, with [CanCan][cancan] for example.

[cancan]: https://github.com/ryanb/cancan/

## Frontend Implementation

As we have everythin in place on the backend, let's see how to connect
to this from the clientside.

We will be using the following approach: If we get a 401
("Unauthorized") response from the server for any of our requests, we
prompt the user for login and password.  These credentials are sent to the server
 and the OAuth2 provider responds with an auth token. This is the previously
 mentioned "Resource Owner Password Credentials" authentication flow.

### Catch 401 response
To check for a 401 response we implement a http interceptor. It is
implemented as a config function of your application module:
{% highlight javascript %}
.config(function($httpProvider) {
  var interceptor = ['$rootScope', '$q', function(scope, $q) {

    function success( response ) {
      return response
    };

    function error( response ) {
      if ( response.status == 401) {
        var deferred = $q.defer();
        scope.$broadcast('event:unauthorized');
        return deferred.promise;
      };
      return $q.reject( response );
    };

    return function( promise ) {
      return promise.then( success, error );
    };

  }];
  $httpProvider.responseInterceptors.push( interceptor );
})
{% endhighlight %}

So for every HTTP response this checks if it is a 401 response. If this
is true a deferred response is created and an event to react on the 401
is broadcasted.

### Login form
We have to deal with the event broadcasted by the HTTP interceptor.
We want to show a login
dialog to get the user credentials and send them to the backend OAuth2
provider. We are using a directive which builds a login form for that:

{% highlight javascript %}
.directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/login.html',
    link: function(scope, element, attrs) {

      scope.$on('event:unauthorized', function( event ) {
        scope.show = true;
      });

      scope.$on('event:authenticated', function( event ) {
        scope.show = false;
      });

      var button = angular.element(element.find('button'));
      button.bind('click', function(){scope.$emit('event:authenticate', scope.username, scope.password)});
    }
  }
})
{% endhighlight %}

As you can see the directive sets the `scope` attribute to `show` when
receiving the `event:unauthorized` event which gets fired by the HTTP
interceptor. When `event:authenticated` gets fired the login
`show` attribute is set to false.

Have a look at the template to see how easy it is to show/hide the login
form:

{% highlight html %}
<div ng-show="show==true">
  <form class="well form-inline">
    <h3>Login</h3>
    <input ng-model="username" type="text" val="username" placeholder="Username">
    <input ng-model="password" type="password" val="password" placeholder="Password">
    <button type="submit" class="btn">Log in</button>
  </form>
</div>
{% endhighlight %}

Have a look at the directive again, there are two lines we did not
discuss yet:
{% highlight javascript %}
      var button = angular.element(element.find('button'));
      button.bind('click', function(){scope.$emit('event:authenticate', scope.username, scope.password)});
{% endhighlight %}

We get the button from the DOM and bind a function to it's `click`
event. In this function we emit a new event called `event:authenticate`
and we pass the user credentials from the login form.

### Send authentication request

To handle the request we bind a function to the broadcasted
`event:authenticate` event. This can be done in the `run` method of you
app module:

{% highlight javascript %}
.run(['$rootScope', '$http', 'TokenHandler', function( scope, $http, tokenHandler ) {
  scope.$on( 'event:authenticate', function( event, username, password ) {
    var payload = {
      username: username,
      password: password,
      grant_type: 'password',
      client_id: 'your-client-id',
      client_secret: 'client-secret' 
    };
    $http.post('http://localhost:3001/oauth2/token', payload).success( function( data ) {
      tokenHandler.set( data.access_token );
      scope.$broadcast('event:authenticated');
    });
  });
}]);
{% endhighlight %}

In the dependecies you find `TokenHandler`. This is not a default
AngularJS module. In my app, this is used to manage the authentication
token you will get from the server in it's response. As you have to use
this auth token in any further request, you may want to [have a look at
my article][authtokenarticle] about how to do this with the `TokenHandler`.

[authtokenarticle]: /angularjs-send-auth-token-with-every--request/

The `payload` variable holds all the data we are going to send to the
server in the authentication request. `username` and `password` are the
user credentials of course. `grant_type: 'password'` defines the OAuth2
authentication flow we want to use. `client_id` and `client_secret` you
did define previously in the backend implementation. You have to send
these to identify the client app. Keep in mind, that these are public.
Even the `secret` does not provide additional security in our
authentication workflow, as it can easily be read from the clientside
javascript code. But still we have to provide it, to identify our client
application.

After setting up the `payload` we actually send the POST request to the
`/token` endpoint of the OAuth2 provider API to get the authentication
token.

Within the `success` callback the auth token is stored via the
`TokenHandler` (again, check out [this article][authtokenarticle] about
it). And we broadcast a new event `event:authenticated` which indicates
that we have a valid auth token now.

You can react to this event in you app. For example the login directive
hides the login form:
{% highlight javascript %}
      scope.$on('event:authenticated', function( event ) {
        scope.show = false;
      });
{% endhighlight %}

You probablby want to get some kind of resource from the backend now. So
you can do so by binding to this event:

{% highlight javascript %}
  $scope.$on('event:authenticated', function() {
    $scope.getResource();
  };
{% endhighlight %}

Whereas `getResource()` sends a request to the server to get data. You
probably want to use [$resource][resouredoc] for this.

[resouredoc]: http://docs.angularjs.org/api/ngResource.$resource
