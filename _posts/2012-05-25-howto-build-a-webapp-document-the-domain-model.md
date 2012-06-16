---
layout: post
title: "HowTo build a webapp: Document the domain model"
description: ""
category: article-series
tags: [howto-webapp]
---
{% include JB/setup %}

In the [previous
article](/2012/05/25/howto-build-a-webapp-define-what-the-app-will-do)
we did define a vision and the key features for a MVP of our app. Now we
will discover the domain of our app and get a model of it. Such a domain
model is a conceptual model of the entities and their
relationships relevant for you app.

## Why you should do it

The reason to produce this is to
clarify your understanding of the problem you are trying to solve with your
app. It is just a structured way to think about your software. By doing so
you often will change your view on the problem: You will discover things you
did not consider beforehand. In other cases you may be able to simplify your
initial ideas.

So you really should focus on thinking about the domain you are
addressing with your app. Creating a visual representation helps in
thinking about it. This is the main reason why to do it. It's not about
creating a documentation which will last forever.

## How you should do it

As we already saw in the previous section, getting the domain model is
about thinking, not about documentation. That's why I tend to use very
lean techniques to visualize the domain model.

You may do a simple hand drawing. Put a box for every entity there and
use linking lines to represent relationships. If you are used to UML or
similar stuff you can use that of course. An UML class diagram would be
a good way to do this.

Whatever you use it should come naturally. If you have to struggle with
the technique (like the different associations in UML) itself this
hinders your thinking process. You should not allow this. Find a
technique which helps you to think about the domain.

Okay so I said documentation is not the main purpose of this step. But
still I suggest you produce some kind of document to at least have all
the entities you came up with. I consider such a thing as very valuable
in the upcoming steps. Just don't take this document for carved in stone
and don't put much effort in getting an extensive document.

## Pomodoro App Example

To document the domain model of the example app I did create a basic [UML
class diagram](http://en.wikipedia.org/wiki/Class_diagram):

[<img src="/assets/images/PomodoroAppDomainModel.png" alt="Pomodoro App
Domain Model" title="Pomodoro App Domain Model"
width="100%"/>](/assets/images/PomodoroAppDomainModel.png)

As I already explained, you do not have to use UML to document this. You
have to find out, what works best for you. The domain model shown above
(hopefully) covers every entity in the app I am going to build. Thus we
can base the API and our implementation on that.

Of course the model does not hold every class we are going to implement!
It is not a class diagram to mirror your implementation. Creating the
domain model is a tool to get known to the domain, the problem you are
going to address with you app.

Got your own domain model? Then go ahead and [create an API]() based on
that.
