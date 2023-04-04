# Atlas
Workflow Tool for Rule Monitoring & Traceability.

## Softwares to be Installed

1. Visual Studio Code 1.52
    - Prettier - Code formatter (plugin)
2. Eclipse Oxygen.3a Release (4.7.3a) -- Optional for editing DEV machine perl files from your laptop
    - EPIC - Eclipse Perl integration (plugin)

## Clone, Checkout & Install

```bash
git clone https://bitbucket.athenahealth.com/scm/colrules/rules-master.git

git checkout dev/21.3 # Checkout the right branch (feature/dev/release)

cd rules-master

npm install
```

## Local/Dev Environment Setup

1. Update your DNS hosts file `/etc/hosts` for Mac & `C:\Windows\System32\drivers\etc\hosts` for Windows as follows.
    ```bash
    127.0.0.1 localhost atlas.athenahealth.com
    ```

2. Create `.env.development.local` file in your project's root directory and add the below entries based on your system settings.
    ```bash
    INTRANET_PROXY_HOST=dev108.athenahealth.com
    INTRANET_PROXY_PORT=58255
    HOST=atlas.athenahealth.com
    ```

## Start the Application

1. To run the application in the development mode from your laptop using node server, run the below command.
    
    `npm start`
    - Redirects to https://atlas.athenahealth.com:3000/ in the browser. Login with your AD credentials.

2. To run the app from DEV box through apache server,
    1. Build the application using the following command

        `npm run build`
    2. Copy the generated javascript bundle file `app.bundle.js` from `dist` folder to your DEV box using any SCP tool to the below mentioned directory

        `/$P4_HOME/intranet/static/collector/workflowtool/dist/`
    3. Harr the server configured in your `.httpd_profile`

        `harr ${ENAME}intranet`

## FAQ

1. How to run specific test?

    `npm test -t CreateTask`

2. How to run all tests with coverage?

    `npm run coverage`

3. How to list the eslint errors?

    `npm run lint`

4. How to create a branch?

   - Go to your JIRA story and use `Create branch` option under `Development` section.
   - Once the popup opens up, select Branch type as `Feature`.
   - Select the base branch from were you would like to create branch, normaly it would be the dev branch.
   - Specify the Branch name with JIRA ID and click `Create branch`.

5. How to push changes to remote repository?
    ```bash
    git checkout <branch_name>
    git add <filename>
    git commit -m <Comments prefixed with Jira Id*>
    git push
    ```

6. How to create pull request?

   - Go to your JIRA story and click on the `branch` link under `Development` section.
   - A popup opens up with the list of branches under the story.
   - Click on `Create pull request` link adjacent to the branch.
   - Create pull request page opens up. Then select `Source` & `Destination` branch, hit continue.
   - Normally, source would be the feature branch and destination would be the dev branch.
   - Add reviewers and `Submit`.
