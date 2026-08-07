import type { CommandEntry } from '../types'

/*
 * Authoring rules (enforced by data.test.ts):
 * - printable ASCII only, no tabs, no leading/trailing whitespace
 * - single line, max 90 chars
 * - tier 1: short everyday commands; tier 2: common flags/pipes;
 *   tier 3: long, flag-heavy, real-world one-liners
 * - commands must be real and syntactically plausible
 */
export const cloud: CommandEntry[] = [
  // tier 1
  { text: 'aws s3 ls', category: 'cloud', difficulty: 1, desc: 'list your s3 buckets' },
  { text: 'aws sts get-caller-identity', category: 'cloud', difficulty: 1, desc: 'show which aws identity you are using' },
  { text: 'aws s3 cp report.pdf s3://my-bucket/', category: 'cloud', difficulty: 1, desc: 'upload a file to an s3 bucket' },
  { text: 'aws ec2 describe-instances', category: 'cloud', difficulty: 1, desc: 'list your ec2 instances' },
  { text: 'gcloud auth login', category: 'cloud', difficulty: 1, desc: 'authenticate the gcloud cli in a browser' },
  { text: 'gcloud projects list', category: 'cloud', difficulty: 1, desc: 'list google cloud projects you can access' },
  { text: 'gcloud compute instances list', category: 'cloud', difficulty: 1, desc: 'list compute engine virtual machines' },
  { text: 'gcloud config list', category: 'cloud', difficulty: 1, desc: 'show the active gcloud configuration' },
  { text: 'az login', category: 'cloud', difficulty: 1, desc: 'sign in to azure from the terminal' },
  { text: 'az group list', category: 'cloud', difficulty: 1, desc: 'list azure resource groups' },
  { text: 'az vm list -o table', category: 'cloud', difficulty: 1, desc: 'list azure virtual machines as a table' },
  { text: 'az account show', category: 'cloud', difficulty: 1, desc: 'show the active azure subscription' },
  { text: 'terraform init', category: 'cloud', difficulty: 1, desc: 'initialize providers and backend state' },
  { text: 'terraform plan', category: 'cloud', difficulty: 1, desc: 'preview infrastructure changes' },
  { text: 'terraform fmt', category: 'cloud', difficulty: 1, desc: 'auto-format terraform config files' },
  { text: 'gh pr list', category: 'cloud', difficulty: 1, desc: 'list open pull requests for this repo' },
  { text: 'gh auth status', category: 'cloud', difficulty: 1, desc: 'check github cli authentication' },
  // tier 2
  { text: 'aws s3 sync ./dist s3://my-bucket --delete', category: 'cloud', difficulty: 2, desc: 'mirror a build directory to s3, pruning removals' },
  { text: 'aws logs tail /aws/lambda/api --follow', category: 'cloud', difficulty: 2, desc: 'stream cloudwatch logs live' },
  { text: 'aws lambda invoke --function-name resize-images out.json', category: 'cloud', difficulty: 2, desc: 'invoke a lambda and capture its response' },
  { text: 'gcloud compute ssh web-1 --zone us-central1-a', category: 'cloud', difficulty: 2, desc: 'ssh into a compute engine instance' },
  { text: 'gcloud container clusters get-credentials prod --region us-east1', category: 'cloud', difficulty: 2, desc: 'wire kubectl up to a gke cluster' },
  { text: 'gcloud app deploy --quiet', category: 'cloud', difficulty: 2, desc: 'deploy to app engine without prompts' },
  { text: 'az vm start -g prod-rg -n web01', category: 'cloud', difficulty: 2, desc: 'start a stopped azure vm' },
  { text: 'az storage blob upload -f app.zip -c releases -n app.zip', category: 'cloud', difficulty: 2, desc: 'upload a file into a blob container' },
  { text: 'az aks get-credentials -g prod-rg -n prod-cluster', category: 'cloud', difficulty: 2, desc: 'fetch kubeconfig for an aks cluster' },
  { text: 'terraform plan -out=tfplan', category: 'cloud', difficulty: 2, desc: 'save a plan file for a later exact apply' },
  { text: 'terraform apply -auto-approve', category: 'cloud', difficulty: 2, desc: 'apply changes without the confirmation prompt' },
  { text: 'terraform state list', category: 'cloud', difficulty: 2, desc: 'list every resource tracked in state' },
  { text: 'terraform workspace select staging', category: 'cloud', difficulty: 2, desc: 'switch to the staging workspace' },
  { text: 'gh pr create --fill', category: 'cloud', difficulty: 2, desc: 'open a pull request using commit info' },
  { text: 'gh pr checkout 128', category: 'cloud', difficulty: 2, desc: 'check out a pull request branch locally' },
  { text: 'gh run watch', category: 'cloud', difficulty: 2, desc: 'follow a workflow run until it finishes' },
  { text: 'gh release create v1.4.0 --generate-notes', category: 'cloud', difficulty: 2, desc: 'cut a release with auto-generated notes' },
  // tier 3
  { text: 'aws s3 sync ./public s3://site-bucket --delete --cache-control "max-age=31536000"', category: 'cloud', difficulty: 3, desc: 'deploy static assets with a one-year cache header' },
  { text: 'aws ec2 describe-instances --filters Name=tag:env,Values=prod --output table', category: 'cloud', difficulty: 3, desc: 'tabulate only the instances tagged as production' },
  { text: 'aws ec2 run-instances --image-id ami-0abcdef12 --count 1 --instance-type t3.micro', category: 'cloud', difficulty: 3, desc: 'launch a small ec2 instance from an image' },
  { text: 'aws s3api list-objects-v2 --bucket logs --query "sum(Contents[].Size)" --output text', category: 'cloud', difficulty: 3, desc: 'total the byte size of everything in a bucket' },
  { text: 'gcloud run deploy api --image gcr.io/p1/api:v2 --region us-east1 --allow-unauthenticated', category: 'cloud', difficulty: 3, desc: 'ship a public cloud run service from an image' },
  { text: 'gcloud sql instances create db1 --database-version=POSTGRES_16 --tier=db-g1-small', category: 'cloud', difficulty: 3, desc: 'provision a small managed postgres instance' },
  { text: 'gcloud compute instances list --filter="status=RUNNING" --format="value(name,zone)"', category: 'cloud', difficulty: 3, desc: 'bare names and zones of only the running vms' },
  { text: 'az webapp create -g prod-rg -p prod-plan -n my-api --runtime "NODE:20-lts"', category: 'cloud', difficulty: 3, desc: 'create a node web app on an existing plan' },
  { text: 'az vm create -g dev-rg -n dev01 --image Ubuntu2204 --admin-username azureuser', category: 'cloud', difficulty: 3, desc: 'spin up an ubuntu dev vm in one line' },
  { text: 'terraform apply -var-file=prod.tfvars -target=module.network -auto-approve', category: 'cloud', difficulty: 3, desc: 'apply just the network module with prod variables' },
  { text: 'terraform import aws_s3_bucket.assets my-assets-bucket && terraform plan', category: 'cloud', difficulty: 3, desc: 'adopt an existing bucket into state, then verify' },
  { text: 'gh api repos/{owner}/{repo}/actions/runs --jq \'.workflow_runs[0].status\'', category: 'cloud', difficulty: 3, desc: 'poll the status of the latest workflow run' },
  { text: 'gh pr list --state open --json number,title --jq \'.[] | "\\(.number) \\(.title)"\'', category: 'cloud', difficulty: 3, desc: 'compact number-and-title list of open prs' },
  { text: 'gh workflow run deploy.yml -f environment=production -f version=v2.3.1', category: 'cloud', difficulty: 3, desc: 'kick off a deploy workflow with inputs' },
]
