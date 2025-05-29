import axios from 'axios';

async function testOAuthFlow() {
    try {
        // Step 1: Get authorization code
        const authUrl = 'http://localhost:3000/oauth/authorize?' + 
            'response_type=code&' +
            'client_id=test-client&' +
            'redirect_uri=http://localhost:3000/callback&' +
            'scope=read write';
        
        console.log('Authorization URL:', authUrl);
        console.log('Please visit this URL in your browser and copy the authorization code');

        // Step 2: Exchange code for tokens
        const tokenResponse = await axios.post('http://localhost:3000/oauth/token', 
            'grant_type=authorization_code&' +
            'code=AUTHORIZATION_CODE&' + // Replace with actual code
            'client_id=test-client&' +
            'client_secret=test-secret&' +
            'redirect_uri=http://localhost:3000/callback',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('Token Response:', tokenResponse.data);

        // Step 3: Use the access token
        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('http://localhost:3000/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('User Data:', userResponse.data);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testOAuthFlow(); 