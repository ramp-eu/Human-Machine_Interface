# Overview

HMI (Human Machine Interface) is a software layer module of the OPIL architecture. This module’s name was changed to MOD.SW.HMI from AHMI when the requirements changed for the OPIL version 2.0.

HMI is a web application server with its own local database for storing data needed in this module. HMI serves a web browser user interface for the human agents to monitor and control OPIL data entities.

# Links to other pages:

opil-MODULENAME.l4ms.eu:

* [Robot Agent Node](http://opil-ran.l4ms.eu)
* [Human Agent Node](http://opil-han.l4ms.eu)
* [Sensor Agent Node](http://opil-san.l4ms.eu) 

## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs help` - Print this help message.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.
