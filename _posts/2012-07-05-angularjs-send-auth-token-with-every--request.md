---
layout: post
title: "AngularJS: Send auth token with every  request"
description: ""
category: software
tags: [angularjs, javascript, API]
---
{% include JB/setup %}

[AngularJS][angularjs] is an awesome javascript framework. With it's
[$resource][angularjs-resource] service it is super fast and easy to connect your javascript
client to a RESTful API. It comes with some good defaults to create a
CRUD interface.

However if you are using an API, which needs authentication via an auth
token, you might run into issues: The resource factory creates a
singleton. If you do not already have an auth token when the factory is
called, or if the auth token changes afterwards, you cannot put the auth
token as a default request parameter in the factory.

This article shows, how to solve this. First we define our resource,
consuming a RESTful API, without using an authentication. Afterwards we
create a wrapper to send the auth token with every request. This allows
consumption of an API with an exchangable auth token.

[angularjs]: http://angularjs.org/
[angularjs-resource]: http://docs.angularjs.org/api/ngResource.$resource

## Build a RESTful resource
Here is a simple example of how to create a resource in your client, fed
by a RESTful backend on your localhost:

{% highlight javascript %}
angular.module('MyApp.services', ['ngResource'])
  .factory('Todo', ['$resource',
    function($resource) {
      var resource =
        $resource('http://localhost:port/todos/:id', {
          port:":3001",
          id:'@id'
          }, {
            update: {method: 'PUT'}
          });
      return resource;
    }])
{% endhighlight %}

We are creating a module which depends on `ngResource`, which provides
the `$resource` service. We build a factory called `Todo` using the
`$resource` service.

Inside the factory we create a `resource` object by passing an URL and a
port to the `$resource` constructor. Have a look at the URL string:
`:port` and `:id` are being replaced by the parameters defined in the
object literal right after the URL string itself.

Settind a port is not as straight forward, as it could be: In this
example we are setting it to 3001. Right now
you cannot put it into the URL directly, as AngularJS would interpret
`:3001` in the URL as a placeholder with the name `3001`. So we put the
placeholder `:port` in the URL and replace it with `:3001` via the
parameter object literal.

Now have a look at the `:id` placeholder: It's being replaced with
`@id`. With the @ in front, AngularJS takes the attribute with that
name from the current resource when doing a request. This is very handy,
when sending non-GET request. Here is a simple example: When sending an
`update` REST action for an resource item with `id=123` the URL will look
like this: `http://localhost:3001/todos/123`.

There is one last thing in the example: We define an `update` action for
our resource. `$resource` defines some default actions:

{% highlight javascript %}
{ 'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'} };
{% endhighlight %}

I have no idea, why an update action is missing. I think it would be
reasonable to add this to the AngularJS default actions. So, as the
`update` action is missing, we define it ourselves. We just have to
provide the HTTP method for it, which is `PUT`.

As you can see, connecting to a REST API is pretty straight forward.

## Send auth token with every request

To send the auth token with every request we are going to wrap the
resource actions in a function which appends the auth token. So first of
all we create a new service to deal with all the token related stuff:

{% highlight javascript %}
  .factory('TokenHandler', function() {
    var tokenHandler = {};
    var token = "none";

    tokenHandler.set = function( newToken ) {
      token = newToken;
    };

    tokenHandler.get = function() {
      return token;
    };

    // wrap given actions of a resource to send auth token with every
    // request
    tokenHandler.wrapActions = function( resource, actions ) {
      // copy original resource
      var wrappedResource = resource;
      for (var i=0; i < actions.length; i++) {
        tokenWrapper( wrappedResource, actions[i] );
      };
      // return modified copy of resource
      return wrappedResource;
    };

    // wraps resource action to send request with auth token
    var tokenWrapper = function( resource, action ) {
      // copy original action
      resource['_' + action]  = resource[action];
      // create new action wrapping the original and sending token
      resource[action] = function( data, success, error){
        return resource['_' + action](
          angular.extend({}, data || {}, {access_token: tokenHandler.get()}),
          success,
          error
        );
      };
    };

    return tokenHandler;
  });
{% highlight %}
