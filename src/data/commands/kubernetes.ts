import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const kubernetes: CommandEntry[] = [
  // tier 1
  { text: 'kubectl get pods', category: 'kubernetes', difficulty: 1, desc: 'list pods in the current namespace' },
  { text: 'kubectl get nodes', category: 'kubernetes', difficulty: 1, desc: 'list cluster nodes and their status' },
  { text: 'kubectl get svc', category: 'kubernetes', difficulty: 1, desc: 'list services in the current namespace' },
  { text: 'kubectl get deployments', category: 'kubernetes', difficulty: 1, desc: 'list deployments and their readiness' },
  { text: 'kubectl get ns', category: 'kubernetes', difficulty: 1, desc: 'list namespaces in the cluster' },
  { text: 'kubectl describe pod web', category: 'kubernetes', difficulty: 1, desc: 'full details and events for one pod' },
  { text: 'kubectl logs api', category: 'kubernetes', difficulty: 1, desc: 'print the log of a pod' },
  { text: 'kubectl apply -f app.yaml', category: 'kubernetes', difficulty: 1, desc: 'create or update resources from a manifest' },
  { text: 'kubectl delete pod web', category: 'kubernetes', difficulty: 1, desc: 'delete a pod by name' },
  { text: 'kubectl get events', category: 'kubernetes', difficulty: 1, desc: 'recent cluster events in this namespace' },
  { text: 'kubectl cluster-info', category: 'kubernetes', difficulty: 1, desc: 'show api server and dns endpoints' },
  { text: 'kubectl config get-contexts', category: 'kubernetes', difficulty: 1, desc: 'list configured cluster contexts' },
  { text: 'kubectl top pods', category: 'kubernetes', difficulty: 1, desc: 'cpu and memory usage per pod' },
  { text: 'helm list', category: 'kubernetes', difficulty: 1, desc: 'list installed helm releases' },
  { text: 'helm repo update', category: 'kubernetes', difficulty: 1, desc: 'refresh helm chart repository indexes' },
  { text: 'kubectl version', category: 'kubernetes', difficulty: 1, desc: 'show client and server versions' },
  // tier 2
  { text: 'kubectl get pods -n kube-system -o wide', category: 'kubernetes', difficulty: 2, desc: 'system pods with node and ip columns' },
  { text: 'kubectl logs -f deploy/api --tail 100', category: 'kubernetes', difficulty: 2, desc: 'follow a deployment log, last 100 lines' },
  { text: 'kubectl exec -it web-7d4b9c -- sh', category: 'kubernetes', difficulty: 2, desc: 'open a shell inside a running pod' },
  { text: 'kubectl port-forward svc/api 8080:80', category: 'kubernetes', difficulty: 2, desc: 'tunnel a cluster service to localhost' },
  { text: 'kubectl scale deploy/api --replicas=3', category: 'kubernetes', difficulty: 2, desc: 'change the replica count of a deployment' },
  { text: 'kubectl rollout restart deploy/api', category: 'kubernetes', difficulty: 2, desc: 'trigger a rolling restart of all pods' },
  { text: 'kubectl rollout status deploy/api', category: 'kubernetes', difficulty: 2, desc: 'watch a rollout until it completes' },
  { text: 'kubectl rollout undo deploy/api', category: 'kubernetes', difficulty: 2, desc: 'roll back to the previous revision' },
  { text: 'kubectl describe node worker-1', category: 'kubernetes', difficulty: 2, desc: 'capacity, taints, and pods on one node' },
  { text: 'kubectl get pods --all-namespaces', category: 'kubernetes', difficulty: 2, desc: 'every pod across every namespace' },
  { text: 'kubectl config use-context staging', category: 'kubernetes', difficulty: 2, desc: 'switch which cluster kubectl talks to' },
  { text: 'kubectl create ns staging', category: 'kubernetes', difficulty: 2, desc: 'create a new namespace' },
  { text: 'kubectl delete pod web --grace-period=0 --force', category: 'kubernetes', difficulty: 2, desc: 'kill a stuck pod immediately' },
  { text: 'kubectl label node worker-1 disktype=ssd', category: 'kubernetes', difficulty: 2, desc: 'label a node for pod scheduling' },
  { text: 'helm upgrade --install api ./charts/api', category: 'kubernetes', difficulty: 2, desc: 'install a chart or upgrade it in place' },
  { text: 'helm rollback api 3', category: 'kubernetes', difficulty: 2, desc: 'revert a release to revision 3' },
  // tier 3
  { text: "kubectl get pods -A -o jsonpath='{range .items[*]}{.metadata.name}{\"\\n\"}{end}'", category: 'kubernetes', difficulty: 3, desc: 'bare pod names via a jsonpath template' },
  { text: 'kubectl run debug --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- api:8080', category: 'kubernetes', difficulty: 3, desc: 'throwaway pod to probe a service from inside' },
  { text: 'kubectl create secret generic dbauth --from-literal=user=admin --from-literal=pass=s3cret', category: 'kubernetes', difficulty: 3, desc: 'create a secret from literal key-value pairs' },
  { text: 'kubectl get events --sort-by=.metadata.creationTimestamp -n prod | tail -n 20', category: 'kubernetes', difficulty: 3, desc: 'newest events last for easy reading' },
  { text: 'kubectl patch svc api -p \'{"spec":{"type":"NodePort"}}\'', category: 'kubernetes', difficulty: 3, desc: 'change a service type with a json patch' },
  { text: 'helm upgrade --install api ./charts/api -n prod -f values-prod.yaml --set image.tag=1.4.2', category: 'kubernetes', difficulty: 3, desc: 'deploy a chart with prod values and a tag override' },
  { text: 'helm install ingress ingress-nginx/ingress-nginx -n ingress --create-namespace', category: 'kubernetes', difficulty: 3, desc: 'install an ingress controller in a fresh namespace' },
  { text: 'kubectl drain worker-2 --ignore-daemonsets --delete-emptydir-data --force --timeout=120s', category: 'kubernetes', difficulty: 3, desc: 'evict everything from a node before maintenance' },
  { text: 'kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase -n prod', category: 'kubernetes', difficulty: 3, desc: 'hand-picked columns from pod objects' },
  { text: 'kubectl autoscale deploy api --min=2 --max=10 --cpu-percent=70 -n prod', category: 'kubernetes', difficulty: 3, desc: 'attach a horizontal pod autoscaler' },
  { text: 'kubectl cp prod/api-7d4b9c:/app/logs/error.log ./error.log -c api', category: 'kubernetes', difficulty: 3, desc: 'copy a file out of a specific container' },
  { text: 'kubectl wait --for=condition=ready pod -l app=api -n prod --timeout=300s', category: 'kubernetes', difficulty: 3, desc: 'block until labeled pods become ready' },
  { text: 'helm template api ./charts/api -f values-prod.yaml | kubectl apply --dry-run=server -f -', category: 'kubernetes', difficulty: 3, desc: 'render a chart and validate it server-side' },
]
