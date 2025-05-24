import { AppDataSource } from '../data/mysql';
import { OAuthClient } from '../entities/OAuthClient';

async function createTestClient() {
    await AppDataSource.initialize();
    
    const clientRepo = AppDataSource.getRepository(OAuthClient);
    
    const testClient = clientRepo.create({
        clientId: 'test-client',
        clientSecret: 'test-secret',
        redirectUris: ['http://localhost:3000/callback'],
        grants: ['authorization_code', 'refresh_token'],
        scopes: ['read', 'write']
    });

    await clientRepo.save(testClient);
    console.log('Test client created:', testClient);
    await AppDataSource.destroy();
}

createTestClient().catch(console.error); 