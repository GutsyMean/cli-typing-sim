import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // generic kubectl flags (same meaning across subcommands)
  { tool: 'kubectl', flag: '-n', desc: 'namespace to operate in', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl', flag: '-o', desc: 'output format, e.g. wide, yaml, json or jsonpath', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl', flag: '-A', desc: 'across all namespaces', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl', flag: '-l', desc: 'select resources by label, key=value', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl', flag: '-c', desc: 'select the container in a multi-container pod', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl', flag: '-w', desc: 'watch for changes and stream updates', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl', flag: '--timeout', desc: 'give up after this long', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl', flag: '--context', desc: 'use this kubeconfig context (cluster)', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl', flag: '--kubeconfig', desc: 'path to a kubeconfig file to use', category: 'kubernetes', difficulty: 3 },
  // apply
  { tool: 'kubectl apply', flag: '-f', desc: 'apply the manifest from this file, url or - for stdin', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl apply', flag: '-k', desc: 'apply a kustomize directory', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl apply', flag: '--dry-run', desc: 'validate without persisting, client or server side', category: 'kubernetes', difficulty: 2 },
  // get
  { tool: 'kubectl get', flag: '--all-namespaces', desc: 'list resources across every namespace', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl get', flag: '--sort-by', desc: 'sort output by a jsonpath field', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl get', flag: '--show-labels', desc: 'append a column with each resource’s labels', category: 'kubernetes', difficulty: 2 },
  // logs
  { tool: 'kubectl logs', flag: '-f', desc: 'follow the log stream', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl logs', flag: '--tail', desc: 'show only the last n lines', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl logs', flag: '--previous', desc: 'logs from the previous, crashed container instance', category: 'kubernetes', difficulty: 2 },
  // exec / run
  { tool: 'kubectl exec', flag: '-it', desc: 'interactive tty session inside the pod', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl run', flag: '-it', desc: 'attach an interactive tty to the new pod', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl run', flag: '--rm', desc: 'delete the pod when the session ends', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl run', flag: '--image', desc: 'container image for the pod', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl run', flag: '--restart', desc: 'restart policy, Never makes a one-off pod', category: 'kubernetes', difficulty: 2 },
  // scale / autoscale
  { tool: 'kubectl scale', flag: '--replicas', desc: 'desired number of replicas', category: 'kubernetes', difficulty: 1 },
  { tool: 'kubectl autoscale', flag: '--min', desc: 'minimum number of replicas for the hpa', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl autoscale', flag: '--max', desc: 'maximum number of replicas for the hpa', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl autoscale', flag: '--cpu-percent', desc: 'target average cpu utilization that triggers scaling', category: 'kubernetes', difficulty: 2 },
  // delete
  { tool: 'kubectl delete', flag: '--grace-period', desc: 'seconds to wait before killing, 0 deletes immediately', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl delete', flag: '--force', desc: 'immediate forced deletion, skipping graceful shutdown', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl delete', flag: '--cascade', desc: 'how dependents are deleted: background, foreground or orphan', category: 'kubernetes', difficulty: 3 },
  // node maintenance
  { tool: 'kubectl drain', flag: '--ignore-daemonsets', desc: 'proceed even though daemonset pods cannot be evicted', category: 'kubernetes', difficulty: 3 },
  { tool: 'kubectl drain', flag: '--delete-emptydir-data', desc: 'evict pods even if they use emptydir volumes', category: 'kubernetes', difficulty: 3 },
  { tool: 'kubectl drain', flag: '--force', desc: 'evict pods not managed by a controller', category: 'kubernetes', difficulty: 3 },
  // secrets / patch / wait / rollout
  { tool: 'kubectl create', flag: '--from-literal', desc: 'add a key=value entry to the secret or configmap', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl patch', flag: '-p', desc: 'json merge patch to apply inline', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl wait', flag: '--for', desc: 'condition to wait for, e.g. condition=ready', category: 'kubernetes', difficulty: 2 },
  { tool: 'kubectl rollout', flag: '--to-revision', desc: 'roll back to this specific revision', category: 'kubernetes', difficulty: 3 },
  // helm
  { tool: 'helm', flag: '-n', desc: 'namespace for the release', category: 'kubernetes', difficulty: 1 },
  { tool: 'helm', flag: '-f', desc: 'values file to layer onto the chart defaults', category: 'kubernetes', difficulty: 1 },
  { tool: 'helm', flag: '--set', desc: 'override a chart value inline, key=value', category: 'kubernetes', difficulty: 1 },
  { tool: 'helm', flag: '--wait', desc: 'wait until resources are ready before returning', category: 'kubernetes', difficulty: 2 },
  { tool: 'helm upgrade', flag: '--install', desc: 'install the release if it does not exist yet', category: 'kubernetes', difficulty: 1 },
  { tool: 'helm upgrade', flag: '--atomic', desc: 'roll back the upgrade automatically if it fails', category: 'kubernetes', difficulty: 3 },
  { tool: 'helm install', flag: '--create-namespace', desc: 'create the target namespace if missing', category: 'kubernetes', difficulty: 2 },
  // helpers that appear alongside kubectl
  { tool: 'wget', flag: '-qO-', desc: 'quiet download, writing the response to stdout', category: 'kubernetes', difficulty: 3 },
  { tool: 'tail', flag: '-n', desc: 'show only the last n lines', category: 'kubernetes', difficulty: 1 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
