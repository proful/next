/* eslint-disable */
import fs from 'fs'
import esbuild from 'esbuild'
import { createRequire } from 'module'

const pkg = createRequire(import.meta.url)('../package.json')

const { log } = console

async function main() {
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true }, e => {
      if (e) {
        throw e
      }
    })
  }

  try {
    esbuild.buildSync({
      entryPoints: ['src/index.tsx'],
      outfile: 'dist/bundle.js',
      bundle: true,
      minify: true,
      sourcemap: true,
      incremental: false,
      target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      metafile: false,
      sourcemap: false,
    })

    fs.copyFile('./src/index.html', './dist/index.html', err => {
      if (err) throw err
    })

    log(`✔ ${pkg.name}: Build completed.`)
  } catch (e) {
    log(`× ${pkg.name}: Build failed due to an error.`)
    log(e)
  }
}

main()
