---
layout: page
title: Welcome
tagline: All in software development
---
{% include JB/setup %}

... to my personal blog about self and software development. Why the
heck a blog about these two topics? A simple answer to that:
Because I am really passionate about these two things!

### Topics on this blog

Probably you will have a good idea, what to expect under the topic
*software development*. This includes posts about coding,
architecture, agile methodologies and similar stuff.

_Self development_ on the other hand is a rather broad topic, not
as easy to define. For me it includes education in general, productivity
methods and 'just getting a nicer guy'. But there are also more physical
aspects of it, like increasing you health, fitness and athletic
achievements.

I have got the impression these two topics are not just a
focus of my own interests, but are also increasing in popularity in
general. The web development scene booms and many involved people really
care about self development too. So whenever possible, I will try to merge
these topics.

Finally I would like to encourage you, to get in touch with me, if you
are interested in this stuff, too. Participate in a discussion on a blog
post or just send me a mail.

### Most recent posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

