#!/usr/bin/env sh

docker-compose -f build/docker-compose/docker-compose.dev.yaml --env-file ./.env down --remove-orphans;

docker network rm network-1
docker network create network-1

docker-compose -f build/docker-compose/docker-compose.dev.yaml --env-file ./.env up -d --build --scale api=2;

echo "\n\n ____";
echo " DEV environment";
echo " Starting application stack...\n\n";

docker-compose -f build/docker-compose/docker-compose.dev.yaml --env-file ./.env logs -f;
