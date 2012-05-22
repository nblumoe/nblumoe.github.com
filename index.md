---
layout: page
title: Welcome
tagline: All in software development
---
{% include JB/setup %}

... to my personal blog about developing web and mobile software.

Here are the most recent posts:

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

