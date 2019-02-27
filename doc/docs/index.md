# Overview

HMI (Human Machine Interface) is a software layer module of the OPIL architecture. This module’s name was changed to MOD.SW.HMI from AHMI when the requirements changed for the OPIL version 2.0.

HMI is a web application server with its own local database for storing data needed in this module. HMI serves a web browser user interface for the human agents to monitor and control OPIL data entities.

# User management

At time of HMI installation a user with administrator role is created. This user is able to define other users with different user roles. Certain parts of the user interface in the web browser could be restricted based on user’s role. HTTP calls to the HMI web server and certain functions could be restricted as well. All the user data is stored in the local database. Additionally HMI creates an entity to the OCB for HAN. This entity’s id is the same unique id as the user id in the local database.

# Floorplan management

From the user interface it is possible to upload to the system floorplan images in png or jpg formats. User is asked to give a name of the floorplan, scale of the image in centimetres per pixel and x- and y-offset values in relation to the robots map. Currently user interface shows the latest uploaded floorplan of the saved ones.

# Task management

Task specifications at the moment are encoded user written text snippets of the task specification language that are saved in the “TaskSpec” type of entities created to the OBC. Web application then subscribes and listens notifications from OCB’s “TaskSpecState” type of entities. User is able to cancel these task specifications which entities are then removed from the OCB.

# Viewing robot and sensor status

User interface has own views for viewing robot status and sensor values information. Web application subscribes all type ‘ROBOT’ and type ‘SensorAgent’ entities. Robots view then when notified shows robot statuses, x- and y-positions and theta value. Sensors view show when notified sensor values in their own chart panel.

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
