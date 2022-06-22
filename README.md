# Where abouts App

An app to track peoples where abouts. Built with Quasar.

**Getting started**

```
docker-compose up -d
```

Once installed you can access the dev site on port 9000. e.g. localhost:9000


**Common commands**

```
# start up dev environment
docker-compose up -d

# stop environment
docker-compose stop

# delete everything and start in a clean environment
docker-compose down -v

# check logs
docker-compose logs -f

# check logs for specific container
docker-compose logs -f quasar

# log into node container (this will allow use of drush and composer)
docker-compose exec quasar sh

```
