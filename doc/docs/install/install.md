## Install and run dockerized app
Build images before starting containers:

    docker-compose up --build
or run containers in the background:

    docker-compose up -d

Remove dangling images if needed:

    docker system prune -f


