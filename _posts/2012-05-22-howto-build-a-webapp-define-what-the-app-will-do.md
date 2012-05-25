---
layout: post
title: "HowTo build a WebApp: Define what the app will do"
description: "To stay focused during implementation you need to know
which functionality your app has to provide."
category: article-series
tags: [howto-webapp]
---
{% include JB/setup %}

[<< Strategic
Planning](/article-series/2012/05/22/howto-build-a-webapp-strategic-planning/)
(Previous Article)

If you are familiar with agile methodologies you may want to avoid a lot
of documentation. In general I think this is a good approach. But it
does not mean, that you should never ever create any documentation. This
first step aims at structuring your ideas and make you think about the
product.

It is very important that you have a precise picture of you application
before you start to design the models for it and implement it. Why is
that true?

You may start with the implementation right from the beginning. You
probably have an idea what the app will do in general. But if you did
this before you might be aware that you did have to change your
implementation often. Maybe you ended up with confusing code, unused
classes and a lot of restructuring. This stuff is very time consuming
and error prone. We want to prevent this as much as possible.

That's why we have this initial phase: We want to be sure that we
implement the right thing. This will save time and reduce frustration.

## What to define: Key Features

Concentrate on the key features of you app. You do not have to consider
everything right now. Just think about the most important things which
are needed to get a product useful for the users. This is called a
minimum viable product (MVP).

I am a big fan of the lean approach when developing web applications.
The most important thing here is to get your product exposed to users as
soon as possible. Then you iterate through your development process by
getting feedback from the users and implementing it. The idea is to
really get the product your customers want to use instead of an
application of which you guessed they would use it.

The key features for a MVP of the Pomodoro App I am working on are the following:
* User can start a 25min timer
* Timer does make a ticking noise
* User can pause timer and track this as a distraction

I already have a lot of other features in mind. But these things have to
wait till I am able to get feedback from the users about them. Maybe
they dont need the stuff or they would want to use it in another way
that I am thinking of right now.

(You may ask why I did include the ticking noise. I consider this
feedback from the timer as a very important part of the Pomodoro
Technique. That's why I want to include it form the beginning on.)

## User Stories

We are going to document the features we want to have. In agile
methodologies a thing called 'user stories' is widely used. To create a
user story you write down the requested feature with a predefined
formatting:

> "As a &lt;role&gt;, I want &lt;goal/desire&gt; so that &lt;benefit&gt;."

Of course you should put something useful in the placeholder.
&lt;role&gt; is to be replaced by an actor. Often this will be a general
user of your app, so put 'user' there. This could also be a specific
user type, like an admin or an anonymous visitor.

Before it gets to abstract and confusing let me show you an example for
a user story:

> "As an user, I want to subscribe to a newsletter, so that I always get
> the latest news."

Often a short version of that is used. In such a case, the
&lt;benefit&gt; is skipped:

> "As an user, I want to subscribe to a newsletter."

Why should you use this? Because it puts an emphasis on things your
users need. Formulating the features like this will help you to keep
focus on delivering value to your users. Ideally a user story is written
by the user or customer himself.

### Use an issue tracker

You should put these user stories in an issue tracker. This is a
software where you keep track of all that have to be implemented. There
are many tools out there to help you with that. If you are using
[github](http://github.com), you get an issue tracker with your repository. It's
not very feature rich but it is a good point to start and might be
enough for smaller projects.

After putting your user stories into the issue tracker you have a very
nice collection of things your users are going to do with the app. These
are the things you should focus on during the implementation.

## Pomodoro App Example

So here are the user stories for the pomodoro app I am going to build
throughout this article series:

* As a user I want to start the pomodoro timer.
* As a user I want to hear a ticking noise from the running timer.
* As a user I want to pause the pomodoro timer.
* As a user I want to track any distraction with a short note.

For this app I dont need more stories than these to get a MVP. However
for another app you may end up with more stories.