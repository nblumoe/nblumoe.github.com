---
layout: post
title: "Rule the bash: Edit CLI input with VIM"
description: "Long input to the command line can be easily edited using vim."
category: tools 
tags: [vim, bash]
---
{% include JB/setup %}

Sometimes we have to write quite long shell commands, right? And from
time to time you have an error in there or want to change a command from
the history to do something else, right?

If you are a vim user you probably hate to navigate with the cursor keys
to the position in the command you would like to change. So why not use
vim (commands) for that?

## Edit current command line in vim

You can easily edit the current bash line with your default text editor
right from the console. I expect you to have vim as your default editor.
;)

Type something in the CLI or get something from
it's history and hit CTRL+x, CTRL+e. This will open your
default text editor and put the current command line in the buffer.

Edit the command as you wish. Then save and close the buffer with :wq. The
command will be executed and you are done!

## Enable vi commands directly in your CLI

Another way to use vim for your command line interface would be to
execute this in your bash:
> set -o vi

This way you will get an insert and command mode right in your command
line! So you can use the movement and replacement commands of vi. If you
like it put this in your ~/.bashrc to make it a permanent change to your
bash.
