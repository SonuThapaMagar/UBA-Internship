import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
      globals: true,
      environment: 'node',
      setupFiles: ['./tests/setup/setupTest.ts'],
      coverage: {
        enabled: true,  
        provider: 'v8', 
        reporter: ['text', 'json', 'html'],
        all: true,      
        include: ['src/**/*.{js,ts}'], 
        exclude: [   
          '**/node_modules/**',
          '**/tests/**',
          '**/*.d.ts'
        ]
      }
    }
  })