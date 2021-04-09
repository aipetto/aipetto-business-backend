# aipetto-business-backend

Example of command to enable CORS in the Google Cloud File Storage using gsutil:
```
gsutil cors set gcp-cors.json gs://aipetto-platform-file-storage
```

#### Deploy Google Cloud - Run (Option selected by now for MVP)
```
gcloud auth login
```

```
latest: digest: sha256:561575c4835e3e97cd1d06e4e24775315d809e3b8f23907fe9dea55624ce421b size: 3054
DONE
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

ID                                    CREATE_TIME                DURATION  SOURCE                                                                                 IMAGES                            STATUS
b03edb47-279c-4508-94c3-b308f39dfd90  2021-04-06T15:00:20+00:00  1M29S     gs://aipetto_cloudbuild/source/1617721190.566734-f9be2a5ded6e4e2da891f58d50ca3a8d.tgz  gcr.io/aipetto/aipetto (+1 more)  SUCCESS

```

Google Cloud Run is a fully-managed compute platform for deploying and scaling containerized applications.

Requirements
Docker Files
Google Cloud Run requires the application to use docker, so add those two files to the backend folder.

backend/Dockerfile
```
FROM node:14
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
CMD ["node", "./dist/server.js"]
```


backend/.dockerignore

node_modules
npm-debug.log
Dockerfile*
docker-compose*
.dockerignore
.git
.gitignore
.env
*/bin
*/obj
README.md
LICENSE
.vscode
Google Cloud Project
Go to https://cloud.google.com/ and create an account.

Create a new project for the production environment. To create a staging environment the steps are the same.

Enable billing
The project needs the billing enabled: https://cloud.google.com/billing/docs/how-to/modify-project.

Google SDK
Install the https://cloud.google.com/sdk.

Sign in to your account calling gcloud auth login.

Deploy
The first step is to build the image with Google Cloud Build.

Replace:

PROJECT-ID: By your Google Cloud project ID.

APPLICATION-ID: By the name of your application.
``` 
gcloud builds submit --tag gcr.io/PROJECT-ID/APPLICATION-ID
```
On your first try, you will receive an error warning you to enable the Google Build API, so please do it and try again.


After the image is built, you can deploy it to Google Cloud Run:
```
gcloud run deploy --image gcr.io/PROJECT-ID/APPLICATION-ID --platform managed --project PROJECT-ID
```
You'll be prompted to:

Enable the API: Select yes.

Region: Select the one you have the database hosted.

Allow unauthenticated invocations: Select yes.

Create deployment scripts
You may want to create a deployment script.

backend/package.json

```
{
...
"scripts": {
...
"deploy:staging": "gcloud builds submit --tag gcr.io/PROJECT-ID-STAGING/APPLICATION-ID --project PROJECT-ID-STAGING && gcloud run deploy backend --image gcr.io/PROJECT-ID-STAGING/APPLICATION-ID --platform managed --project PROJECT-ID-STAGING --memory=2Gi --region us-central1",
"deploy:production": "gcloud builds submit --tag gcr.io/PROJECT-ID-PRODUCTION/APPLICATION-ID --project PROJECT-ID-PRODUCTION && gcloud run deploy backend --image gcr.io/PROJECT-ID-PRODUCTION/APPLICATION-ID --platform managed --project PROJECT-ID-PRODUCTION --memory=2Gi --region us-central1"
},
...
}
```

Environment Variables
Go to the Google Cloud Run console.

Select the service you just deployed.

Click on Edit & Deploy a new Revision.

Go to variables and add the environment variables.

The environment variables are the same you set on the setup but related to production, with a few changes.

Backend
/setup/backend
FRONTEND_URL and FRONTEND_URL_WITH_SUBDOMAIN

Set this to your hosted frontend URL (if you have one already).

BACKEND_URL

Set this one with the URL you received after the first deployment. Don't forget to add the /api suffix. It will be something like https://APPLICATION-ID-RANDOM-CODE-uc.a.run.app/api.