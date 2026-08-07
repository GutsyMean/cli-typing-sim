import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // generic output shaping (same meaning across subcommands)
  { tool: 'docker', flag: '--format', desc: 'format the output using a go template', category: 'docker', difficulty: 2 },
  { tool: 'docker', flag: '--filter', desc: 'filter output by condition, e.g. status, label or until', category: 'docker', difficulty: 2 },
  // docker ps
  { tool: 'docker ps', flag: '-a', desc: 'show all containers, including stopped ones', category: 'docker', difficulty: 1 },
  // docker run
  { tool: 'docker run', flag: '-d', desc: 'run detached in the background', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '-it', desc: 'interactive with a tty, for a shell inside the container', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '-p', desc: 'publish a container port to the host, host:container', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '--name', desc: 'assign a name to the container', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '--rm', desc: 'remove the container automatically when it exits', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '-v', desc: 'mount a volume or bind-mount a host path', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '-w', desc: 'working directory inside the container', category: 'docker', difficulty: 2 },
  { tool: 'docker run', flag: '-e', desc: 'set an environment variable in the container', category: 'docker', difficulty: 1 },
  { tool: 'docker run', flag: '--env-file', desc: 'load environment variables from a file', category: 'docker', difficulty: 2 },
  { tool: 'docker run', flag: '--restart', desc: 'restart policy, e.g. always or unless-stopped', category: 'docker', difficulty: 2 },
  { tool: 'docker run', flag: '--network', desc: 'connect the container to this network', category: 'docker', difficulty: 2 },
  { tool: 'docker run', flag: '--cap-add', desc: 'grant an extra linux capability to the container', category: 'docker', difficulty: 3 },
  { tool: 'docker run', flag: '--entrypoint', desc: 'override the image entrypoint', category: 'docker', difficulty: 3 },
  // logs / exec
  { tool: 'docker logs', flag: '-f', desc: 'follow log output as it is written', category: 'docker', difficulty: 1 },
  { tool: 'docker logs', flag: '--since', desc: 'only logs newer than the given time', category: 'docker', difficulty: 2 },
  { tool: 'docker exec', flag: '-it', desc: 'interactive tty session inside a running container', category: 'docker', difficulty: 1 },
  // build
  { tool: 'docker build', flag: '-t', desc: 'name and optionally tag the built image', category: 'docker', difficulty: 1 },
  { tool: 'docker build', flag: '-f', desc: 'path to the dockerfile to build from', category: 'docker', difficulty: 2 },
  { tool: 'docker build', flag: '--build-arg', desc: 'set a build-time ARG value', category: 'docker', difficulty: 2 },
  { tool: 'docker build', flag: '--no-cache', desc: 'rebuild every layer without using the cache', category: 'docker', difficulty: 2 },
  // buildx
  { tool: 'docker buildx', flag: '--platform', desc: 'target platforms to build for, e.g. linux/amd64,linux/arm64', category: 'docker', difficulty: 2 },
  { tool: 'docker buildx', flag: '-t', desc: 'name and tag the built image', category: 'docker', difficulty: 2 },
  { tool: 'docker buildx', flag: '--push', desc: 'push the built image to the registry after building', category: 'docker', difficulty: 2 },
  // compose
  { tool: 'docker compose', flag: '-d', desc: 'start services detached in the background', category: 'docker', difficulty: 1 },
  { tool: 'docker compose', flag: '--build', desc: 'build images before starting the services', category: 'docker', difficulty: 2 },
  { tool: 'docker compose', flag: '--force-recreate', desc: 'recreate containers even if their config is unchanged', category: 'docker', difficulty: 2 },
  { tool: 'docker compose', flag: '--remove-orphans', desc: 'remove containers for services no longer in the compose file', category: 'docker', difficulty: 2 },
  { tool: 'docker compose', flag: '-f', desc: 'follow log output as it is written', category: 'docker', difficulty: 1 },
  { tool: 'docker compose', flag: '--tail', desc: 'show only the last n lines of the logs', category: 'docker', difficulty: 2 },
  // housekeeping
  { tool: 'docker system', flag: '-af', desc: 'prune all unused objects without prompting', category: 'docker', difficulty: 2 },
  { tool: 'docker system', flag: '-v', desc: 'show detailed per-object disk usage', category: 'docker', difficulty: 3 },
  { tool: 'docker builder', flag: '-f', desc: 'prune the build cache without prompting', category: 'docker', difficulty: 3 },
  { tool: 'docker image', flag: '-f', desc: 'remove dangling images without prompting', category: 'docker', difficulty: 2 },
  { tool: 'docker rm', flag: '-f', desc: 'force-remove a running container', category: 'docker', difficulty: 2 },
  { tool: 'docker stats', flag: '--no-stream', desc: 'print one snapshot instead of streaming updates', category: 'docker', difficulty: 2 },
  { tool: 'docker history', flag: '--no-trunc', desc: 'show full untruncated layer commands', category: 'docker', difficulty: 3 },
  // registry / images
  { tool: 'docker login', flag: '-u', desc: 'username for the registry', category: 'docker', difficulty: 1 },
  { tool: 'docker save', flag: '-o', desc: 'write the image tarball to this file', category: 'docker', difficulty: 2 },
  // network
  { tool: 'docker network', flag: '--driver', desc: 'network driver to use, e.g. bridge or overlay', category: 'docker', difficulty: 2 },
  { tool: 'docker network', flag: '--subnet', desc: 'cidr subnet for the network', category: 'docker', difficulty: 3 },
  { tool: 'docker network', flag: '--gateway', desc: 'gateway address for the subnet', category: 'docker', difficulty: 3 },
  // resource limits
  { tool: 'docker update', flag: '--memory', desc: 'memory limit for the container', category: 'docker', difficulty: 3 },
  { tool: 'docker update', flag: '--memory-swap', desc: 'total memory plus swap limit', category: 'docker', difficulty: 3 },
  { tool: 'docker update', flag: '--cpus', desc: 'number of cpus the container may use', category: 'docker', difficulty: 3 },
  // tools that appear inside container commands
  { tool: 'psql', flag: '-U', desc: 'connect as this database user', category: 'docker', difficulty: 2 },
  { tool: 'psql', flag: '-d', desc: 'database name to connect to', category: 'docker', difficulty: 2 },
  { tool: 'pg_dump', flag: '-U', desc: 'connect as this database user', category: 'docker', difficulty: 2 },
  { tool: 'tcpdump', flag: '-i', desc: 'capture on this network interface', category: 'docker', difficulty: 3 },
  { tool: 'go', flag: '-o', desc: 'write the compiled binary to this path', category: 'docker', difficulty: 3 },
  { tool: 'head', flag: '-n', desc: 'show only the first n lines', category: 'docker', difficulty: 1 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
