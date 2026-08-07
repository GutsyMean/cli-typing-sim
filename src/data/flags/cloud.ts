import type { FlagEntry } from './types'

export const flags: FlagEntry[] = [
  // aws (global)
  { tool: 'aws', flag: '--output', desc: 'output format: json, table, or text', category: 'cloud', difficulty: 1 },
  { tool: 'aws', flag: '--query', desc: 'jmespath expression to filter and shape the output', category: 'cloud', difficulty: 2 },
  { tool: 'aws', flag: '--region', desc: 'aws region to send the request to', category: 'cloud', difficulty: 1 },
  { tool: 'aws', flag: '--profile', desc: 'named credentials profile to use', category: 'cloud', difficulty: 2 },
  // aws s3 / s3api
  { tool: 'aws s3', flag: '--delete', desc: 'remove destination files that no longer exist in the source', category: 'cloud', difficulty: 2 },
  { tool: 'aws s3', flag: '--cache-control', desc: 'set the cache-control header on uploaded objects', category: 'cloud', difficulty: 3 },
  { tool: 'aws s3', flag: '--recursive', desc: 'apply the operation to all objects under the prefix', category: 'cloud', difficulty: 1 },
  { tool: 'aws s3', flag: '--exclude', desc: 'skip objects matching the given pattern', category: 'cloud', difficulty: 2 },
  { tool: 'aws s3api', flag: '--bucket', desc: 'name of the s3 bucket to operate on', category: 'cloud', difficulty: 2 },
  // aws ec2 / logs / lambda
  { tool: 'aws ec2', flag: '--filters', desc: 'filter results, e.g. by tag name and value', category: 'cloud', difficulty: 2 },
  { tool: 'aws ec2', flag: '--image-id', desc: 'ami id to launch the instance from', category: 'cloud', difficulty: 2 },
  { tool: 'aws ec2', flag: '--count', desc: 'number of instances to launch', category: 'cloud', difficulty: 2 },
  { tool: 'aws ec2', flag: '--instance-type', desc: 'instance size to launch, e.g. t3.micro', category: 'cloud', difficulty: 1 },
  { tool: 'aws logs', flag: '--follow', desc: 'keep streaming new log events as they arrive', category: 'cloud', difficulty: 1 },
  { tool: 'aws logs', flag: '--since', desc: 'only show events newer than the given time', category: 'cloud', difficulty: 2 },
  { tool: 'aws lambda', flag: '--function-name', desc: 'name of the lambda function to target', category: 'cloud', difficulty: 1 },
  { tool: 'aws lambda', flag: '--payload', desc: 'json input to pass to the function invocation', category: 'cloud', difficulty: 2 },
  // gcloud
  { tool: 'gcloud', flag: '--quiet', desc: 'disable interactive prompts and accept defaults', category: 'cloud', difficulty: 1 },
  { tool: 'gcloud', flag: '--region', desc: 'region for the resource or operation', category: 'cloud', difficulty: 1 },
  { tool: 'gcloud', flag: '--project', desc: 'google cloud project to operate on', category: 'cloud', difficulty: 1 },
  { tool: 'gcloud', flag: '--format', desc: 'output format, e.g. json or table', category: 'cloud', difficulty: 2 },
  { tool: 'gcloud compute', flag: '--zone', desc: 'compute zone of the instance, e.g. us-central1-a', category: 'cloud', difficulty: 1 },
  { tool: 'gcloud run', flag: '--image', desc: 'container image to deploy', category: 'cloud', difficulty: 1 },
  { tool: 'gcloud run', flag: '--allow-unauthenticated', desc: 'allow public access without authentication', category: 'cloud', difficulty: 2 },
  { tool: 'gcloud run', flag: '--memory', desc: 'memory limit for the service instances', category: 'cloud', difficulty: 2 },
  { tool: 'gcloud sql', flag: '--database-version', desc: 'database engine and version, e.g. postgres_16', category: 'cloud', difficulty: 2 },
  { tool: 'gcloud sql', flag: '--tier', desc: 'machine tier for the database instance', category: 'cloud', difficulty: 2 },
  // az
  { tool: 'az', flag: '-o', desc: 'output format: table, json, or tsv', category: 'cloud', difficulty: 1 },
  { tool: 'az', flag: '-g', desc: 'resource group name', category: 'cloud', difficulty: 1 },
  { tool: 'az', flag: '-n', desc: 'name of the resource', category: 'cloud', difficulty: 1 },
  { tool: 'az', flag: '--query', desc: 'jmespath expression to filter the output', category: 'cloud', difficulty: 2 },
  { tool: 'az', flag: '--subscription', desc: 'subscription to run the command against', category: 'cloud', difficulty: 2 },
  { tool: 'az storage', flag: '-f', desc: 'local file to upload', category: 'cloud', difficulty: 2 },
  { tool: 'az storage', flag: '-c', desc: 'storage container name', category: 'cloud', difficulty: 2 },
  { tool: 'az vm', flag: '--image', desc: 'os image to create the vm from', category: 'cloud', difficulty: 1 },
  { tool: 'az vm', flag: '--admin-username', desc: 'administrator account name for the vm', category: 'cloud', difficulty: 2 },
  { tool: 'az vm', flag: '--size', desc: 'vm size, e.g. standard_b2s', category: 'cloud', difficulty: 2 },
  { tool: 'az vm', flag: '--generate-ssh-keys', desc: 'create ssh keys if they do not already exist', category: 'cloud', difficulty: 2 },
  { tool: 'az webapp', flag: '-p', desc: 'app service plan for the web app', category: 'cloud', difficulty: 2 },
  { tool: 'az webapp', flag: '--runtime', desc: 'language runtime stack, e.g. node 20 lts', category: 'cloud', difficulty: 2 },
  // terraform
  { tool: 'terraform plan', flag: '-out', desc: 'save the plan to a file for a later apply', category: 'cloud', difficulty: 2 },
  { tool: 'terraform plan', flag: '-destroy', desc: 'plan the destruction of all managed resources', category: 'cloud', difficulty: 2 },
  { tool: 'terraform apply', flag: '-auto-approve', desc: 'apply without interactive confirmation', category: 'cloud', difficulty: 1 },
  { tool: 'terraform apply', flag: '-var-file', desc: 'load variable values from the given tfvars file', category: 'cloud', difficulty: 2 },
  { tool: 'terraform apply', flag: '-target', desc: 'limit the operation to a specific resource or module', category: 'cloud', difficulty: 3 },
  { tool: 'terraform init', flag: '-upgrade', desc: 'upgrade providers and modules to the newest allowed versions', category: 'cloud', difficulty: 2 },
  // gh
  { tool: 'gh', flag: '--jq', desc: 'filter json output with a jq expression', category: 'cloud', difficulty: 2 },
  { tool: 'gh pr', flag: '--fill', desc: 'use commit info to fill the pr title and body', category: 'cloud', difficulty: 1 },
  { tool: 'gh pr', flag: '--state', desc: 'filter by state: open, closed, or merged', category: 'cloud', difficulty: 1 },
  { tool: 'gh pr', flag: '--json', desc: 'output the named fields as json', category: 'cloud', difficulty: 2 },
  { tool: 'gh pr', flag: '--web', desc: 'open the result in the browser', category: 'cloud', difficulty: 1 },
  { tool: 'gh pr', flag: '--draft', desc: 'create the pull request as a draft', category: 'cloud', difficulty: 1 },
  { tool: 'gh release', flag: '--generate-notes', desc: 'auto-generate release notes from merged prs', category: 'cloud', difficulty: 2 },
  { tool: 'gh release', flag: '--notes', desc: 'release notes text to attach', category: 'cloud', difficulty: 2 },
  { tool: 'gh workflow', flag: '-f', desc: 'pass a key=value input to the workflow run', category: 'cloud', difficulty: 2 },
  { tool: 'gh workflow', flag: '--ref', desc: 'branch or tag to run the workflow on', category: 'cloud', difficulty: 2 },
]

/** "<command text> :: <flag>" pairs intentionally left without glossary entries */
export const coverageExceptions: string[] = []
