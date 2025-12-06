import type { ResourcesConfig } from "aws-amplify";

const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID;
const POOL_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: POOL_CLIENT_ID,
      identityPoolId: IDENTITY_POOL_ID,
    },
  },
  Storage: {
    S3: {
      bucket: "mylib-internal-files",
      region: "sa-east-1"
    }
  }
};

export default awsConfig;
