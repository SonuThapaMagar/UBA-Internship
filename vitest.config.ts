import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
      globals: true,
      environment: 'node',
      coverage: {
        enabled: false,  
        provider: 'v8', 
        reporter: ['text', 'json', 'html'],
        all: true,      
        include: ['src/**/*.{js,ts}'], 
        exclude: [   
          '**/node_modules/**',
          '**/tests/**',
          '**/*.d.ts',
          'src/types/*.ts',
          'src/config/*.ts',
          'src/migrations/*.ts',
          'src/entity/*.ts',
          'src/data/*.ts',
          'src/index.ts',
          'src/app.ts',
        ]
      },
    }
  })