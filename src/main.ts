import * as core from '@actions/core'
import {parseToolVersions} from './asdf'
import path from 'node:path'

async function run(): Promise<void> {
  try {
    const file = path.join(process.cwd(), '.tool-versions')
    core.debug(file)
    const tools = await parseToolVersions(file)

    core.warning('All found versions are exported to env variables')
    core.startGroup('.tool-versions')
    for (const [key, value] of tools) {
      core.info(`Gathered '${key}' version ${value}`)
      core.info(`Exported as ${key.toUpperCase()}_VERSION`)
      core.exportVariable(`${key.toUpperCase()}_VERSION`, value)
    }
    core.endGroup()

    core.setOutput('tools', JSON.stringify(Object.fromEntries(tools)))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
