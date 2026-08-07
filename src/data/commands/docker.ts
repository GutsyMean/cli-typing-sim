import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const docker: CommandEntry[] = [
  // tier 1
  { text: 'docker ps', category: 'docker', difficulty: 1, desc: 'list running containers' },
  { text: 'docker ps -a', category: 'docker', difficulty: 1, desc: 'list all containers, including stopped ones' },
  { text: 'docker images', category: 'docker', difficulty: 1, desc: 'list local images' },
  { text: 'docker pull nginx:alpine', category: 'docker', difficulty: 1, desc: 'download an image from the registry' },
  { text: 'docker run -it ubuntu bash', category: 'docker', difficulty: 1, desc: 'start a container with an interactive shell' },
  { text: 'docker stop web', category: 'docker', difficulty: 1, desc: 'gracefully stop a running container' },
  { text: 'docker start web', category: 'docker', difficulty: 1, desc: 'start a stopped container' },
  { text: 'docker restart web', category: 'docker', difficulty: 1, desc: 'stop and start a container in one step' },
  { text: 'docker rm web', category: 'docker', difficulty: 1, desc: 'delete a stopped container' },
  { text: 'docker rmi nginx:alpine', category: 'docker', difficulty: 1, desc: 'delete a local image' },
  { text: 'docker logs -f api', category: 'docker', difficulty: 1, desc: 'stream a container log in real time' },
  { text: 'docker exec -it api sh', category: 'docker', difficulty: 1, desc: 'open a shell inside a running container' },
  { text: 'docker build -t myapp .', category: 'docker', difficulty: 1, desc: 'build an image from the local dockerfile' },
  { text: 'docker compose up -d', category: 'docker', difficulty: 1, desc: 'start the compose stack in the background' },
  { text: 'docker compose down', category: 'docker', difficulty: 1, desc: 'stop and remove the compose stack' },
  { text: 'docker volume ls', category: 'docker', difficulty: 1, desc: 'list named volumes' },
  // tier 2
  { text: 'docker run -d -p 8080:80 --name web nginx', category: 'docker', difficulty: 2, desc: 'detached nginx with a published port' },
  { text: 'docker system prune -af', category: 'docker', difficulty: 2, desc: 'reclaim space by removing unused objects' },
  { text: "docker inspect --format '{{.State.Status}}' api", category: 'docker', difficulty: 2, desc: 'pull one field from container metadata' },
  { text: 'docker network create --driver bridge appnet', category: 'docker', difficulty: 2, desc: 'create a user-defined bridge network' },
  { text: 'docker cp api:/app/logs/error.log ./error.log', category: 'docker', difficulty: 2, desc: 'copy a file out of a container' },
  { text: 'docker tag myapp:latest registry.local:5000/myapp:1.4.2', category: 'docker', difficulty: 2, desc: 'retag an image for a private registry' },
  { text: 'docker push registry.local:5000/myapp:1.4.2', category: 'docker', difficulty: 2, desc: 'upload an image to a private registry' },
  { text: 'docker stats --no-stream', category: 'docker', difficulty: 2, desc: 'one-shot cpu and memory usage snapshot' },
  { text: 'docker image prune -f', category: 'docker', difficulty: 2, desc: 'remove dangling images without prompting' },
  { text: 'docker compose logs -f --tail 100 api', category: 'docker', difficulty: 2, desc: 'follow one service log, last 100 lines' },
  { text: 'docker run --rm -v $(pwd):/work -w /work node:20 npm ci', category: 'docker', difficulty: 2, desc: 'throwaway container to install deps' },
  { text: 'docker history --no-trunc myapp:latest', category: 'docker', difficulty: 2, desc: 'show every layer of an image, untruncated' },
  { text: 'docker login registry.example.com -u deploy', category: 'docker', difficulty: 2, desc: 'authenticate against a private registry' },
  { text: 'docker save -o myapp.tar myapp:latest', category: 'docker', difficulty: 2, desc: 'export an image to a tar archive' },
  { text: 'docker exec -it postgres psql -U admin -d appdb', category: 'docker', difficulty: 2, desc: 'open a database shell inside a container' },
  { text: 'docker volume create pgdata', category: 'docker', difficulty: 2, desc: 'create a named volume for persistent data' },
  // tier 3
  { text: 'docker run -d -p 3000:3000 --restart unless-stopped -e NODE_ENV=production myapp:1.4.2', category: 'docker', difficulty: 3, desc: 'production container that survives reboots' },
  { text: 'docker build -t registry.local:5000/api:1.4.2 --build-arg VERSION=1.4.2 --no-cache .', category: 'docker', difficulty: 3, desc: 'clean build with a version build argument' },
  { text: 'docker run --rm -v $(pwd):/src -w /src golang:1.22 go build -o /src/bin/app ./cmd/app', category: 'docker', difficulty: 3, desc: 'compile a go binary without installing go' },
  { text: 'docker ps --filter status=exited --format "table {{.Names}}\\t{{.Status}}"', category: 'docker', difficulty: 3, desc: 'tabulate exited containers by name and status' },
  { text: 'docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 appnet', category: 'docker', difficulty: 3, desc: 'bridge network with an explicit subnet' },
  { text: 'docker run -d -e POSTGRES_PASSWORD=secret -v pgdata:/var/lib/postgresql/data postgres:16', category: 'docker', difficulty: 3, desc: 'postgres with credentials and durable storage' },
  { text: 'docker compose up -d --build --force-recreate --remove-orphans api worker', category: 'docker', difficulty: 3, desc: 'rebuild and cleanly recreate two services' },
  { text: 'docker exec -it db pg_dump -U admin appdb | gzip > backup-$(date +%F).sql.gz', category: 'docker', difficulty: 3, desc: 'dated compressed database dump from a container' },
  { text: 'docker image ls --format "{{.Repository}}:{{.Tag}} {{.Size}}" | sort | head -n 20', category: 'docker', difficulty: 3, desc: 'sorted image list with tags and sizes' },
  { text: 'docker run --rm --network host --cap-add NET_ADMIN nicolaka/netshoot tcpdump -i eth0', category: 'docker', difficulty: 3, desc: 'sniff host traffic from a debug container' },
  { text: 'docker system df -v && docker builder prune --filter until=72h -f', category: 'docker', difficulty: 3, desc: 'audit disk usage, then drop old build cache' },
  { text: 'docker buildx build --platform linux/amd64,linux/arm64 -t org/app:2.0 --push .', category: 'docker', difficulty: 3, desc: 'multi-arch build pushed straight to the registry' },
  { text: 'docker update --memory 512m --memory-swap 1g --cpus 1.5 api-worker', category: 'docker', difficulty: 3, desc: 'adjust resource limits on a live container' },
]
