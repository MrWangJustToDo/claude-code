#!/usr/bin/env node
/**
 * Postinstall script for @anthropic/ink — downloads the @my-react devtool
 * runtime hook and saves it to src/devtool.js.
 *
 * The hook script is loaded at runtime (via require('./devtool.js') in
 * index.ts) when MY_REACT_DEVTOOL=1 is set. It enables the @my-react
 * DevTools to inspect the Ink React component tree.
 *
 * Runs idempotently — skips if the file already exists.
 * Never fails the install (non-fatal).
 */

const { existsSync, mkdirSync, writeFileSync } = require('fs')
const path = require('path')

const RUNTIME_URL =
  'https://mrwangjusttodo.github.io/myreact-devtools/bundle/hook.js'

// Resolve paths relative to this script
const scriptDir = path.dirname(__filename)
const packageDir = path.resolve(scriptDir, '..')
const destDir = path.join(packageDir, 'src')
const destFile = path.join(destDir, 'devtool.js')

async function main() {
  // if (existsSync(destFile)) {
  //   console.log('[ink-devtool] devtool.js already exists, skipping download.')
  //   return
  // }

  console.log('[ink-devtool] Downloading @my-react devtool runtime...')

  try {
    const response = await fetch(RUNTIME_URL, { redirect: 'follow' })
    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`,
      )
    }
    const text = await response.text()
    mkdirSync(destDir, { recursive: true })
    writeFileSync(destFile, text)
    console.log(
      `[ink-devtool] Installed devtool.js (${Math.round(text.length / 1024)} KB)`,
    )
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn(
      `[ink-devtool] Download failed (non-fatal): ${msg}`,
    )
    console.warn(
      '[ink-devtool] DevTool runtime not available — run `bun run dev:devtool` to retry download.',
    )
  }
}

main()
