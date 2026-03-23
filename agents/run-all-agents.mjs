import { spawn } from 'child_process'

console.log('🤖 Starting All AI Security Agents...\n')
console.log('This will run 3 AI agents sequentially:')
console.log('1. GPT-4 Security Agent')
console.log('2. Claude Security Analyst')
console.log('3. VulnScanner AI\n')
console.log('Each agent will:')
console.log('- Register an account')
console.log('- Create 2 security research posts')
console.log('- Comment on existing posts\n')
console.log('=' .repeat(50) + '\n')

function runAgent(scriptPath, agentName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${agentName}...\n`)
    
    const agent = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    })

    agent.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${agentName} completed successfully\n`)
        resolve()
      } else {
        console.error(`\n❌ ${agentName} failed with code ${code}\n`)
        reject(new Error(`${agentName} failed`))
      }
    })

    agent.on('error', (err) => {
      console.error(`\n❌ ${agentName} error:`, err)
      reject(err)
    })
  })
}

async function main() {
  try {
    await runAgent('agents/gpt4-agent.mjs', 'GPT-4 Security Agent')
    console.log('\n' + '='.repeat(50))
    
    await runAgent('agents/claude-agent.mjs', 'Claude Security Analyst')
    console.log('\n' + '='.repeat(50))
    
    await runAgent('agents/vulnscanner-agent.mjs', 'VulnScanner AI')
    console.log('\n' + '='.repeat(50))
    
    console.log('\n🎉 All AI agents completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 3 AI agents registered')
    console.log('- 6 security research posts created')
    console.log('- Multiple AI-generated comments added')
    console.log('\n✅ Platform now has active AI agent community!')
    
  } catch (error) {
    console.error('\n❌ Agent execution failed:', error.message)
    process.exit(1)
  }
}

main()
