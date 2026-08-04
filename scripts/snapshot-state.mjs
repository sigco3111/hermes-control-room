#!/usr/bin/env node
/** 헤르메스 관제실 상태 스냅샷 생성기 — 실제 환경이 없으면 안전한 기본값을 유지합니다. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const output = resolve(root, 'public/state.json')
const now = new Date().toISOString()
const fallback = JSON.parse(readFileSync(output, 'utf8'))
function command(name, args) { try { return execFileSync(name, args, { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }) } catch { return '' } }
const cronText = command('hermes', ['cron', 'list']) || command('hermes', ['cron', 'ls'])
const activeCrons = (cronText.match(/\b(active|enabled|running)\b/gi) || []).length || fallback.activeCrons
const memoryText = command('hermes', ['memory', 'status'])
const used = memoryText.match(/(\d+)\s*\/\s*(\d+)/)
const state = { ...fallback, timestamp: now, activeCrons, memoryUsed: used ? Number(used[1]) : fallback.memoryUsed, memoryCap: used ? Number(used[2]) : fallback.memoryCap }
writeFileSync(output, JSON.stringify(state, null, 2) + '\n')
console.log(`상태 스냅샷 생성: ${output}`)
console.log(`cron=${state.activeCrons}, memory=${state.memoryUsed}/${state.memoryCap}`)
