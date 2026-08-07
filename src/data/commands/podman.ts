import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const podman: CommandEntry[] = [
  // tier 1
  { text: 'podman ps', category: 'podman', difficulty: 1, desc: 'list running containers' },
  { text: 'podman ps -a', category: 'podman', difficulty: 1, desc: 'list all containers, including stopped ones' },
  { text: 'podman images', category: 'podman', difficulty: 1, desc: 'list local images' },
  { text: 'podman pull docker.io/library/alpine', category: 'podman', difficulty: 1, desc: 'download an image with its full name' },
  { text: 'podman run -it alpine sh', category: 'podman', difficulty: 1, desc: 'start a container with an interactive shell' },
  { text: 'podman stop web', category: 'podman', difficulty: 1, desc: 'gracefully stop a running container' },
  { text: 'podman start web', category: 'podman', difficulty: 1, desc: 'start a stopped container' },
  { text: 'podman rm web', category: 'podman', difficulty: 1, desc: 'delete a stopped container' },
  { text: 'podman rmi alpine', category: 'podman', difficulty: 1, desc: 'delete a local image' },
  { text: 'podman logs -f api', category: 'podman', difficulty: 1, desc: 'stream a container log in real time' },
  { text: 'podman exec -it api bash', category: 'podman', difficulty: 1, desc: 'open a shell inside a running container' },
  { text: 'podman build -t myapp .', category: 'podman', difficulty: 1, desc: 'build an image from the local containerfile' },
  { text: 'podman pod ps', category: 'podman', difficulty: 1, desc: 'list pods and their status' },
  { text: 'podman info', category: 'podman', difficulty: 1, desc: 'show host and storage configuration' },
  { text: 'podman search nginx', category: 'podman', difficulty: 1, desc: 'search configured registries for an image' },
  { text: 'podman version', category: 'podman', difficulty: 1, desc: 'show client and api versions' },
  // tier 2
  { text: 'podman run -d -p 8080:80 --name web nginx', category: 'podman', difficulty: 2, desc: 'detached nginx with a published port' },
  { text: 'podman pod create --name webstack -p 8080:80', category: 'podman', difficulty: 2, desc: 'create a pod that owns the port mapping' },
  { text: 'podman run -d --pod webstack nginx:alpine', category: 'podman', difficulty: 2, desc: 'add a container to an existing pod' },
  { text: 'podman system prune -af', category: 'podman', difficulty: 2, desc: 'reclaim space by removing unused objects' },
  { text: "podman inspect --format '{{.State.Status}}' api", category: 'podman', difficulty: 2, desc: 'pull one field from container metadata' },
  { text: 'podman cp api:/app/config.yml ./config.yml', category: 'podman', difficulty: 2, desc: 'copy a file out of a container' },
  { text: 'podman volume create pgdata', category: 'podman', difficulty: 2, desc: 'create a named volume for persistent data' },
  { text: 'podman tag myapp:latest quay.io/user/myapp:1.0', category: 'podman', difficulty: 2, desc: 'retag an image for quay' },
  { text: 'podman push quay.io/user/myapp:1.0', category: 'podman', difficulty: 2, desc: 'upload an image to a remote registry' },
  { text: 'podman login quay.io -u deploy', category: 'podman', difficulty: 2, desc: 'authenticate against a registry' },
  { text: 'podman stats --no-stream', category: 'podman', difficulty: 2, desc: 'one-shot cpu and memory usage snapshot' },
  { text: 'podman image prune -f', category: 'podman', difficulty: 2, desc: 'remove dangling images without prompting' },
  { text: 'podman unshare chown -R 1000:1000 ./data', category: 'podman', difficulty: 2, desc: 'fix volume ownership in the rootless userns' },
  { text: 'podman commit web myapp:snapshot', category: 'podman', difficulty: 2, desc: 'save a running container as a new image' },
  { text: 'podman top api', category: 'podman', difficulty: 2, desc: 'list processes running inside a container' },
  { text: 'podman generate kube webstack -f webstack.yaml', category: 'podman', difficulty: 2, desc: 'export a pod as kubernetes yaml' },
  // tier 3
  { text: 'podman run -d -p 8080:80 --restart always -v ./site:/usr/share/nginx/html:Z nginx', category: 'podman', difficulty: 3, desc: 'serve local files with an selinux-safe mount' },
  { text: 'podman pod create --name appstack -p 8080:80 -p 5432:5432 --network bridge', category: 'podman', difficulty: 3, desc: 'pod exposing web and database ports' },
  { text: 'podman run -d --pod appstack -e POSTGRES_PASSWORD=secret postgres:16-alpine', category: 'podman', difficulty: 3, desc: 'run postgres inside an existing pod' },
  { text: 'podman kube play --replace --network appnet appstack.yaml', category: 'podman', difficulty: 3, desc: 'recreate a pod from kubernetes yaml' },
  { text: 'podman run --rm -v $(pwd):/src:Z -w /src node:20-alpine npm run build', category: 'podman', difficulty: 3, desc: 'throwaway build container with a relabeled mount' },
  { text: 'podman build --build-arg VERSION=2.1.0 -t quay.io/org/api:2.1.0 -f Containerfile .', category: 'podman', difficulty: 3, desc: 'versioned build from an explicit containerfile' },
  { text: 'podman run -d --name db --health-cmd "pg_isready -U admin" --health-interval 30s postgres', category: 'podman', difficulty: 3, desc: 'database container with a built-in healthcheck' },
  { text: 'podman ps --filter status=running --format "{{.Names}} {{.Image}} {{.Status}}"', category: 'podman', difficulty: 3, desc: 'custom columns for running containers' },
  { text: 'podman generate systemd --new --files --name webstack && systemctl --user daemon-reload', category: 'podman', difficulty: 3, desc: 'turn a pod into user systemd units' },
  { text: 'podman run --rm --userns keep-id -v ~/.ssh:/home/dev/.ssh:ro,Z -it fedora:40 bash', category: 'podman', difficulty: 3, desc: 'rootless shell that keeps your uid and keys' },
  { text: 'podman auto-update --dry-run --format "{{.Unit}} {{.Image}} {{.Updated}}"', category: 'podman', difficulty: 3, desc: 'preview which units would pull new images' },
  { text: 'podman save --format oci-archive -o myapp-1.4.tar quay.io/org/myapp:1.4', category: 'podman', difficulty: 3, desc: 'export an image as an oci archive' },
  { text: 'podman system connection add prod ssh://deploy@prod01:22/run/user/1000/podman/podman.sock', category: 'podman', difficulty: 3, desc: 'register a remote rootless podman host' },
]
