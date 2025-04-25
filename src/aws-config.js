import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';

const awsConfig = {
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_FMToSIaBs',
        userPoolWebClientId: '3lun12tjl375jodv2j6o9mmfkm',
        mandatorySignIn: true,
        authenticationFlowType: 'USER_SRP_AUTH'
    },
    API: {
        endpoints: [
            {
                name: 'books',
                endpoint: 'https://p9gff0jso3.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1',
                custom_header: async () => {
                    try {
                        const session = await Auth.currentSession();
                        return {
                            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`,
                            'Content-Type': 'application/json'
                        };
                    } catch (error) {
                        console.error('Error getting session:', error);
                        return {};
                    }
                }
            }
        ]
    },
    Storage: {
        AWSS3: {
            bucket: 'YOUR_S3_BUCKET_NAME',
            region: 'us-east-1'
        }
    }
};

Amplify.configure(awsConfig);

export default awsConfig; 