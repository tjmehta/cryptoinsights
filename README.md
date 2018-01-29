# cryptoinsights
an application that collects and analyzes crypto market data from exchanges

# development environment

```
source .env && \
docker run --name postgres -e POSTGRES_USER=$PGUSER -e POSTGRES_PASSWORD=$PGPASSWORD -e POSTGRES_DB=$PGDATABASE -p 5432:5432 postgres
```
