---
layout: post
title: "HowTo build a webapp: Strategic Planning"
description: "First article in this series about building a modern
Webapp from scratch to deployment"
category: article-series
tags: [howto-webapp]
---
{% include JB/setup %}

## Intro

Hi and welcome to the first article in this series. I will cover the
whole process of building a modern Webapp. We will start with an initial
planning (covered in this article) and finish with the public deployment
of the app.

I will rather focus on the development process than on implementation.
There are a lot of great tutorials out there to learn how to code and
implement stuff. This series has two goals:

* encourage and teach readers to use a well structured process when
  building an app
* test myself to see how much I am aware of all the things to consider
  and document that

Please be aware that there is no single development process which fits
every project! There are parts which you probablby will find in most
parts. But there are also things which are not needed at any time.
Furthermore one could discuss about the order of the different steps.
Keep that in mind when adopting this for you project.

## What are we going to build?

Throughout the series I will build a Webapp to use the Pomodoro
Technique. So you can track the development progress with this project.

I will use established, modern techniques to do so. I dont focus on the
latest, hyped technologies, but rather solid, well known and robust
suff. I love things like Node.js and meteor.js! But I came up with the idea
for these articles because I wanted to improve my Ruby on Rails skills
for a project I am currently working on: [UFOstart](http://ufostart.com).

So I am biased towards some products as I want to learn more about them. But I am
not going to build a dinosaur! But as I am not focusing on
implementation this series should also be applicable to your node,
django or whatever project.

## What's missing in this series?

You will not find informations about how to validate you product idea. But I
would like to mention that you definitely should do so if you want to
get a commercial product and make money out of it. With my background i
as a developer I hate to say this, but: Markets are more important than
functionality!

As I am doing this project as a one man show I will not cover team
building and coordination. Regarding the coordination I recommend to
read about SCRUM, I love it.

So let's go for it and get a basic outline for the whole project.

## Outlining the development process

I will throw the outline at you and explain it afterwards:

1. Get a plan for the project (we just startet with that)
2. Define what the app will do
3. Document the domain model
4. Define an API
5. Build the backend with RESTful API
6. Build a web frontend client
7. Deploy the product

This is the basic idea of the workflow. We start from scratch, get the
concepts done and build it afterwards. After that we will have a
deployable product and publish that.

If your project is non-trivial (that's almost every piece of software) and you
really want to make something out of it, you will iterate through this
process. Of course you will not define the whole API again and again but
you will cycle through concept (1.-4.), building (5.+6.) and deployment phases.

In the follow-up articles I will cover these steps in single articles.
But lets get a short description of every step right here:

### 1. Define what the app will do

This step is very important. If we would not define the app
functionality in the first place but start to implement it too soon, we
easily end up with confusing, unfinished software. We need a well
defined functionality to stay focused and implement the important
things.

### 2. Document the domain model

With the knowledge what the app should be capable of doing we will
create a domain model. This is a conceptual model for the app. It helps
tremendously to do an efficient and effectiv implementation.

### 3. Define an API

From the domain model we have all the entities in our app. We are going
to make the models and behaviour available through an API. Before
starting the actual implementation we will define this API. Together
with the domain model we have defined what exactly has to be
implemented.

### 4. Build the backend with RESTful API

At this point we are well prepared to start coding! We will start with
the backend as the core of our app. From the domain model you will get
data models and database structure. The API is based on the predefined
concept.

### 5. Build a web frontend client

As we have the backend in place, we can start to implement a client
which consumes the API and allows usage of the app.

### 6. Deploy the product

In this final step we are going to push our app to a server and make it
available to the public.

Continue Reading:
[Define what the app will do >>](/article-series/2012/05/25/howto-build-a-webapp-define-what-the-app-will-do/)
