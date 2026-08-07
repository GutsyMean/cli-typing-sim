import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // generic output shaping (same meaning across subcommands)
  { tool: 'podman', flag: '--format', desc: 'format the output using a go template', category: 'podman', difficulty: 2 },
  { tool: 'podman', flag: '--filter', desc: 'filter output by condition, e.g. status or label', category: 'podman', difficulty: 2 },
  // podman ps
  { tool: 'podman ps', flag: '-a', desc: 'show all containers, including stopped ones', category: 'podman', difficulty: 1 },
  // podman run
  { tool: 'podman run', flag: '-d', desc: 'run detached in the background', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '-it', desc: 'interactive with a tty, for a shell inside the container', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '-p', desc: 'publish a container port to the host, host:container', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '--name', desc: 'assign a name to the container', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '--rm', desc: 'remove the container automatically when it exits', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '-v', desc: 'mount a volume or bind-mount a host path, :Z relabels for selinux', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '-w', desc: 'working directory inside the container', category: 'podman', difficulty: 2 },
  { tool: 'podman run', flag: '-e', desc: 'set an environment variable in the container', category: 'podman', difficulty: 1 },
  { tool: 'podman run', flag: '--restart', desc: 'restart policy, e.g. always or on-failure', category: 'podman', difficulty: 2 },
  { tool: 'podman run', flag: '--pod', desc: 'run the container inside an existing pod', category: 'podman', difficulty: 2 },
  { tool: 'podman run', flag: '--userns', desc: 'user namespace mode, keep-id maps to your own uid', category: 'podman', difficulty: 3 },
  { tool: 'podman run', flag: '--privileged', desc: 'give the container extended privileges on the host', category: 'podman', difficulty: 2 },
  { tool: 'podman run', flag: '--health-cmd', desc: 'command run periodically to check container health', category: 'podman', difficulty: 3 },
  { tool: 'podman run', flag: '--health-interval', desc: 'time between health checks', category: 'podman', difficulty: 3 },
  // logs / exec
  { tool: 'podman logs', flag: '-f', desc: 'follow log output as it is written', category: 'podman', difficulty: 1 },
  { tool: 'podman exec', flag: '-it', desc: 'interactive tty session inside a running container', category: 'podman', difficulty: 1 },
  // build
  { tool: 'podman build', flag: '-t', desc: 'name and optionally tag the built image', category: 'podman', difficulty: 1 },
  { tool: 'podman build', flag: '--build-arg', desc: 'set a build-time ARG value', category: 'podman', difficulty: 2 },
  { tool: 'podman build', flag: '-f', desc: 'path to the containerfile to build from', category: 'podman', difficulty: 2 },
  // pods
  { tool: 'podman pod', flag: '--name', desc: 'name the new pod', category: 'podman', difficulty: 1 },
  { tool: 'podman pod', flag: '-p', desc: 'publish a port for the whole pod, host:container', category: 'podman', difficulty: 2 },
  { tool: 'podman pod', flag: '--network', desc: 'network mode for the pod, e.g. bridge', category: 'podman', difficulty: 2 },
  // kube workflow
  { tool: 'podman kube', flag: '--replace', desc: 'replace existing pods created from the same yaml', category: 'podman', difficulty: 2 },
  { tool: 'podman kube', flag: '--network', desc: 'attach the played pods to this network', category: 'podman', difficulty: 2 },
  { tool: 'podman generate', flag: '-f', desc: 'write the generated yaml to a file', category: 'podman', difficulty: 2 },
  { tool: 'podman generate', flag: '--new', desc: 'generate units that create fresh containers on start', category: 'podman', difficulty: 3 },
  { tool: 'podman generate', flag: '--files', desc: 'write the unit files to disk instead of stdout', category: 'podman', difficulty: 3 },
  { tool: 'podman generate', flag: '--name', desc: 'use container or pod names in the unit names', category: 'podman', difficulty: 3 },
  // housekeeping
  { tool: 'podman system', flag: '-af', desc: 'prune all unused objects without prompting', category: 'podman', difficulty: 2 },
  { tool: 'podman image', flag: '-f', desc: 'remove dangling images without prompting', category: 'podman', difficulty: 2 },
  { tool: 'podman rm', flag: '-f', desc: 'force-remove a running container', category: 'podman', difficulty: 2 },
  { tool: 'podman stats', flag: '--no-stream', desc: 'print one snapshot instead of streaming updates', category: 'podman', difficulty: 2 },
  { tool: 'podman images', flag: '-q', desc: 'show only image ids', category: 'podman', difficulty: 2 },
  // registry / images
  { tool: 'podman login', flag: '-u', desc: 'username for the registry', category: 'podman', difficulty: 1 },
  { tool: 'podman save', flag: '--format', desc: 'archive format to write, e.g. oci-archive or docker-archive', category: 'podman', difficulty: 3 },
  { tool: 'podman save', flag: '-o', desc: 'write the image archive to this file', category: 'podman', difficulty: 2 },
  // auto-update
  { tool: 'podman auto-update', flag: '--dry-run', desc: 'check for image updates without applying them', category: 'podman', difficulty: 3 },
  // helpers that appear alongside podman
  { tool: 'chown', flag: '-R', desc: 'change ownership recursively', category: 'podman', difficulty: 1 },
  { tool: 'systemctl', flag: '--user', desc: 'operate on the per-user systemd instance', category: 'podman', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
