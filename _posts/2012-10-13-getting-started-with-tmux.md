---
layout: post
title: "Tame the command line: How to get started with tmux"
description: ""
category: software
tags: [tools, CLI]
---
{% include JB/setup %}

If you are using lots of command line tools (being a cool guy, you
should!), you most probably have a need to organize all this stuff. If
you are a web developer for example, you want to edit files, have a look
on your webserver logs, monitor automated tests, handle your git repo
and so on. There is a lot of stuff going on there!

All these tools want to be tamed, to achieve your most productive
work flow. Handling lots of separate terminal windows often is not the
most efficient thing. That's where [tmux][1] comes into play.

## What is tmux good for?

tmux simply stands for "terminal multiplexer" and is an alternative to
the well known [screen][2]. It's most obvious use is to manage
multiple terminals. This could also be achieved by using a window
manager with tiling support like [xmonad][3] or [KWin][4]. The benefit
of tmux here is, that it works within a terminal. Thus it can be used
via ssh on a remote server without a GUI.

Here is an example session, used to work on my PhD thesis:

[<img src="/assets/images/tmux_phd.png" alt="tmux Example"
title="tmux Example"
width="100%"/>](/assets/images/tmux_phd.png)

It is built with a
client/server architecture. This allows to use it for (remote) pair
programming. Furthermore you could put your tmux session on a remote
server and have a persistent working environment at hand everywhere.

You can define the layout of your tmux sessions and execute commands when
starting it. This way it is easy to kick off your working environment
with all the stuff you need to be productive right away.  There are even more things you could do with it, but let us rather have
a look on how to use it!

## Installation and Setup

In recent Linux distributions you should have a tmux package available.
So installation should be as easy as:

{% highlight bash %}
$ sudo apt-get install tmux
{% endhighlight %}

You would be ready to go for it, by starting a new tmux session via

{% highlight bash %}
$ tmux new-session
{% endhighlight %}

But I would recommend you also have a look at [tmuxinator][5]. This nice
ruby gem simplifies the setup of your tmux sessions. For example you
would want to create a specific session for a web development project.
When starting the session it would automatically change the directory
and fire up all your tools like servers and the editor.
(If you do not want to use a ruby gem
for that, you can achieve the same thing with shell scripts.)

So let's also install tmuxinator :

{% highlight bash %}
$ gem install tmuxinator
{% endhighlight %}

tmuxinator wants to start your favorite editor, so make sure you set an
environment variable $EDITOR accordingly. Also put this in your
`~/.bashrc`:
{% highlight bash %}
[[ -s $HOME/.tmuxinator/scripts/tmuxinator ]] && source
$HOME/.tmuxinator/scripts/tmuxinator
{% endhighlight %}

## Create a Project and use it

I will show you now, how to get a nice setup for a Ruby on Rails
project. Feel free to adapt it to your own needs.

Create a new project with tmuxinator first:

{% highlight bash %}
$ tmuxinator new awesome_app
{% endhighlight %}

This will create a yaml setup file in `~/.tmuxinator/` and should fire up
your editor with that file. If not, just open it by hand.

Within this file, you setup a project name and a directory for that
project first. All shell commands you provide will be executed in this
directory.

You can also specify a gemset for rvm to use (I prefer to have a .rvmrc
file, so I leave it empty) and a command which gets executed prior
during startup with `pre`.

After that you should provide the layout you want to have. Under `tabs`
you put all the windows you want to have: First give it a name and if
you want to, also provide a shell command to be run in that window.

For example `server: rails s` will create a window called 'server' and
start the rails server in it.

If you want to have multiple panes within a window, you can also provide
these in the yaml configuration. Define which tmux layout you want to
use with `layout: <layout_name>` first. Afterwards give a collection of
panes to fill this layout with `panes`. Every item in the collection
only has to provide the shell command to be run within. You can also use
'empty' panes like `- #empty` to simply get a CLI pane, without any
command being run intially.

A basic Ruby on Rails project environment could look like this:
{% highlight yaml %}
# ~/.tmuxinator/awesome_app.yml
# you can make as many tabs as you wish...

project_name: awesome_app
project_root: ~/git_repos/awesome_app
socket_name: foo # Not needed.  Remove to use default socket
rvm:
pre:
tabs:
  - editor:
      layout: main-vertical
      panes:
        - vim
        - git fetch
  - console: rails c
  - capistrano:
  - server: rails s
  - logs: tail -f log/development.log
{% endhighlight %}

It has 5 windows, the first one called 'editor' has two panes. One pane
starts up with vim editor, whereas the other pane executes git fetch on
startup. Thus we automatically have the latest changes from our remote
git repo and vim at hand. The other windows start with the rails
console, an empty shell (I am using it for capistrano stuff, thus the
name), the rails server and finally a window which holds most recent log
output.

To start working with this setup simply type
{% highlight bash %}
$ tmuxinator awesome_app
{% endhighlight %}

and you are ready to go, having an up-to-date repo, a running server and
your editor right in place. `mux` is an alias for `tmuxinator` so you
could also use `mux awesome_app` instead.

To get help for tmux commands simply hit `Ctrl+B ?` to show all the tmux
commands. You should easily figure out, how to move around between
windows and panes. If you want to exit your tmux session you could
either do `Ctrl+B :kill-session` (kills the session) or `Ctrl+B d`
 (detach only, session persists).

## Additional Settings

 You can also configure lots of tmux behavior by editing
`~/.tmux.conf`. Here is my configuration:

{% highlight yaml %}
# act like vim
setw -g mode-keys vi
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
bind-key -r C-h select-window -t :-
bind-key -r C-l select-window -t :+

# act like GNU screen
unbind C-b
set -g prefix C-a

# look good
set -g default-terminal "xterm-256color"
{% endhighlight %}

Should be self explaining mostly, first block makes tmux keys more
vim-like. Also I am changing the tmux prefix binding to `Ctrl+A`. I had
quite some trouble getting colors right within tmux: Using the last
setting here and defining the `$TERM` via a bash alias in `~/.bashrc` finally did the
trick:

{% highlight bash %}
alias tmux='TERM=xterm-256color tmux -2'
alias tmuxinator='TERM=xterm-256color tmuxinator'
alias mux='TERM=xterm-256color mux'
{% endhighlight %}

As I already said in the beginning, there is a lot of other stuff you
could do and learn with tmux. But this article should get you going to
use it in your daily work, providing easily accessible working environments.

## Links
- [tmux][1]
- [tmuxinator][5]
- [xmonad][3]
- [KWin][4]

[1]: http://tmux.sourceforge.net/ "tmux"
[2]: http://www.gnu.org/software/screen/ "GNU Screen"
[3]: http://xmonad.org/ "xmonad"
[4]: http://userbase.kde.org/KWin "KWin"
[5]: https://github.com/aziz/tmuxinator "tmuxinator"
