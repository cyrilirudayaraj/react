import { DeploymentDetails } from '../../types';

export const DeploymentData1: DeploymentDetails = {
  verifiedYn: null,
  statusId: '3',
  status: 'IN PROGRESS',
  decisionServiceName: 'claims service',
  createdBy: 'vsivachandran',
  branchName: 'atlas-testing',
  logs: [
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/json' 'https://odmdc.dev.claimrules.aws.athenahealth.com/decisioncenter-api/v1/decisionservices?q=name%3Aclaims%20service'",
      statusId: '1',
      version: '1',
      response:
        '{"elements":[{"id":"a84acd90-909e-4c74-90e0-ffb677a9fa77","internalId":"brm.RuleProject:29:29","name":"claims service","buildMode":"DecisionEngine"}],"totalCount":1,"number":0,"size":1}',
      name: 'GetDecisionServiceInfoFromDecisionCenter',
      message: 'Received Decision Service name as claims service',
      ordering: '1',
      action: 'Fetch Decisionservice info from Decision center',
      category: null,
      id: '1089',
    },
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/json' 'https://odmdc.dev.claimrules.aws.athenahealth.com/decisioncenter-api/v1/decisionservices/a84acd90-909e-4c74-90e0-ffb677a9fa77/branches?q=name%3Aatlas-testing'",
      statusId: '1',
      version: '1',
      response:
        '{"elements":[{"id":"81b450f8-3c18-4e75-96e2-215fa771efa5","internalId":"brm.Branch:25394:25394","name":"atlas-testing","parentId":"4af95053-d77b-4872-bf09-1e5798d5a55b","documentation":"atlas-testing","buildMode":"DecisionEngine","main":false,"kind":"Branch"}],"totalCount":1,"number":0,"size":1}',
      name: 'GetBranchInfoFromDecisionCenter',
      message: 'Received branch name as atlas-testing',
      ordering: '2',
      action: 'Fetch Branch info from Decision center',
      category: null,
      id: '1090',
    },
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/json' 'https://odmdc.dev.claimrules.aws.athenahealth.com/decisioncenter-api/v1/decisionservices/a84acd90-909e-4c74-90e0-ffb677a9fa77/deployments?baselineId=81b450f8-3c18-4e75-96e2-215fa771efa5&q=name%3ADEV_Prem'",
      statusId: '1',
      version: '1',
      response:
        '{"elements":[{"id":"544c395f-f462-49e2-ae0d-27ac595b5d06","internalId":"dsm.Deployment:392:394","name":"DEV_Prem","production":false,"description":null,"ruleAppName":"premruleapp","ruleAppVersion":"1.0","snapshotMode":"Never"}],"totalCount":1,"number":0,"size":1}',
      name: 'GetDeploymentInfoFromDecisionCenter',
      message: 'Received Deployment id as 544c395f-f462-49e2-ae0d-27ac595b5d06',
      ordering: '3',
      action: 'Fetch Deployment info from Decision Center',
      category: null,
      id: '1091',
    },
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/octet-stream' 'https://odmdc.dev.claimrules.aws.athenahealth.com/decisioncenter-api/v1/deployments/544c395f-f462-49e2-ae0d-27ac595b5d06/download?baselineId=81b450f8-3c18-4e75-96e2-215fa771efa5&includeXOMInArchive=true' --output '/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImlpQrOGSAAAIupyAYAAAAF-dev111.athenahealth.com-35753_3E6LLqvmAQzqe64N/claims-service-20210428141254.jar'",
      statusId: '1',
      version: '1',
      response:
        '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:02 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:03 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:04 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:05 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:06 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:07 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:08 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:09 --:--:--     0\r  0     0    0     0    0     0      0      0 --:--:--  0:00:10 --:--:--     0\r  0 3096k    0  5779    0     0    552      0  1:35:43  0:00:10  1:35:33  1328\r100 3096k  100 3096k    0     0   290k      0  0:00:10  0:00:10 --:--:--  874k\n',
      name: 'DownloadRuleAppFromDecisionCenter',
      message:
        'Downloaded ruleapp archive at /tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImlpQrOGSAAAIupyAYAAAAF-dev111.athenahealth.com-35753_3E6LLqvmAQzqe64N',
      ordering: '4',
      action: 'Generate build and download archive from Decision Center',
      category: null,
      id: '1092',
    },
    {
      request:
        "curl -s -u '$username:$password' --header 'Content-Type:application/octet-stream' --header 'X-File-Name:claims-service-20210428141254.jar' --header 'X-Requested-With:XMLHttpRequest' --data-binary '\\@/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImlpQrOGSAAAIupyAYAAAAF-dev111.athenahealth.com-35753_3E6LLqvmAQzqe64N/claims-service-20210428141254.jar' -X POST 'https://odmds.dev.claimrules.aws.athenahealth.com/res/api/v1/ruleapps?accept=application%2Fjson'",
      statusId: '1',
      version: '1',
      response:
        '{\n  "succeeded" : true,\n  "resource" : [ {\n    "initialPath" : "/premruleapp/1.0",\n    "resultPath" : "/premruleapp/1.0",\n    "operationType" : "UPDATE"\n  }, {\n    "initialPath" : "/premruleapp/1.0/scrubnewclaim/1.0",\n    "resultPath" : "/premruleapp/1.0/scrubnewclaim/1.293",\n    "operationType" : "CHANGE_VERSION_AND_ADD",\n    "managedXomGeneratedProperty" : "reslib://premruleapp_1.0/1.3,"\n  }, {\n    "type" : "LIB",\n    "initialPath" : "/premruleapp_1.0/1.0",\n    "resultPath" : "/premruleapp_1.0/1.3",\n    "operationType" : "ALREADY_PRESENT"\n  } ]\n}',
      name: 'UploadRuleAppToProdMirror',
      message:
        'Ruleapp version updated from /premruleapp/1.0/scrubnewclaim/1.0 to /premruleapp/1.0/scrubnewclaim/1.293',
      ordering: '5',
      action: 'Upload to RES in Prod-Mirror',
      category: null,
      id: '1093',
    },
    {
      request:
        "curl -X PUT -u '$username:$password' -T /tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImlpQrOGSAAAIupyAYAAAAF-dev111.athenahealth.com-35753_3E6LLqvmAQzqe64N/claims-service-20210428141254.jar http://artifactory.aws.athenahealth.com/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar",
      statusId: '1',
      version: '1',
      response:
        '{\n  "repo" : "libs-snapshot-local",\n  "path" : "/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar",\n  "created" : "2021-04-28T18:13:11.494Z",\n  "createdBy" : "vsivachandran",\n  "downloadUri" : "http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar",\n  "mimeType" : "application/java-archive",\n  "size" : "3170466",\n  "checksums" : {\n    "sha1" : "b589e33ceaf27e9c2eee2b2b86ea5eacff7d47ba",\n    "md5" : "3b7357143732c66f6fa060692b9902a5",\n    "sha256" : "34168d8b7780d727e3f0cddced229d59e644c43f4c78756a11286420cafa6f8c"\n  },\n  "originalChecksums" : {\n    "sha256" : "34168d8b7780d727e3f0cddced229d59e644c43f4c78756a11286420cafa6f8c"\n  },\n  "uri" : "http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar"\n}',
      name: 'UploadRuleAppToArtifactory',
      message:
        'Ruleapp successfully uploaded to artifactory. Download from here http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar',
      ordering: '6',
      action: 'Upload ruleapp archive to artifactory',
      category: null,
      id: '1094',
    },
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/octet-stream' 'http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar' --output '/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YIml9grOGSAAAIupyAcAAAAF-dev111.athenahealth.com-35753_TcWHjclz2dQyjbIP/claims-service-20210428141254.jar'",
      statusId: '1',
      version: '1',
      response:
        '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0\r100 3096k  100 3096k    0     0  23.0M      0 --:--:-- --:--:-- --:--:-- 25.8M\n',
      name: 'DownloadRuleAppFromArtifactory',
      message:
        'Downloaded ruleapp archive from artifactory at /tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YIml9grOGSAAAIupyAcAAAAF-dev111.athenahealth.com-35753_TcWHjclz2dQyjbIP',
      ordering: '7',
      action: 'Download ruleapp archive from Artifactory',
      category: null,
      id: '1095',
    },
    {
      request:
        "curl -s -u '$username:$password' --header 'Content-Type:application/octet-stream' --header 'X-File-Name:claims-service-20210428141254.jar' --header 'X-Requested-With:XMLHttpRequest' --data-binary '\\@/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YIml9grOGSAAAIupyAcAAAAF-dev111.athenahealth.com-35753_TcWHjclz2dQyjbIP/claims-service-20210428141254.jar' -X POST 'https://odmds.dev.claimrules.aws.athenahealth.com/res/api/v1/ruleapps?accept=application%2Fjson'",
      statusId: '1',
      version: '1',
      response:
        '{\n  "succeeded" : true,\n  "resource" : [ {\n    "initialPath" : "/premruleapp/1.0",\n    "resultPath" : "/premruleapp/1.0",\n    "operationType" : "UPDATE"\n  }, {\n    "initialPath" : "/premruleapp/1.0/scrubnewclaim/1.0",\n    "resultPath" : "/premruleapp/1.0/scrubnewclaim/1.294",\n    "operationType" : "CHANGE_VERSION_AND_ADD",\n    "managedXomGeneratedProperty" : "reslib://premruleapp_1.0/1.3,"\n  }, {\n    "type" : "LIB",\n    "initialPath" : "/premruleapp_1.0/1.0",\n    "resultPath" : "/premruleapp_1.0/1.3",\n    "operationType" : "ALREADY_PRESENT"\n  } ]\n}',
      name: 'UploadRuleAppToProdEast',
      message:
        'Ruleapp version updated from /premruleapp/1.0/scrubnewclaim/1.0 to /premruleapp/1.0/scrubnewclaim/1.294',
      ordering: '8',
      action: 'Upload to RES in Prod-East',
      category: null,
      id: '1096',
    },
    {
      request:
        "curl -u '$username:$password' -X GET --header 'Accept: application/octet-stream' 'http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar' --output '/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImmDwrOGSAAAIuhrRMAAAAC-dev111.athenahealth.com-35745_BAH6hTKQUHAyTU2M/claims-service-20210428141254.jar'",
      statusId: '1',
      version: '1',
      response:
        '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n\r  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0\r100 3096k  100 3096k    0     0  20.8M      0 --:--:-- --:--:-- --:--:-- 23.4M\n',
      name: 'DownloadRuleAppFromArtifactory',
      message:
        'Downloaded ruleapp archive from artifactory at /tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImmDwrOGSAAAIuhrRMAAAAC-dev111.athenahealth.com-35745_BAH6hTKQUHAyTU2M',
      ordering: '9',
      action: 'Download ruleapp archive from Artifactory',
      category: null,
      id: '1097',
    },
    {
      request:
        "curl -s -u '$username:$password' --header 'Content-Type:application/octet-stream' --header 'X-File-Name:claims-service-20210428141254.jar' --header 'X-Requested-With:XMLHttpRequest' --data-binary '\\@/tmp/ADT-_collector_rules2_workflow_api_v1_deployment_deploy-YImmDwrOGSAAAIuhrRMAAAAC-dev111.athenahealth.com-35745_BAH6hTKQUHAyTU2M/claims-service-20210428141254.jar' -X POST 'https://odmds.dev.claimrules.aws.athenahealth.com/res/api/v1/ruleapps?accept=application%2Fjson'",
      statusId: '1',
      version: '1',
      response:
        '{\n  "succeeded" : true,\n  "resource" : [ {\n    "initialPath" : "/premruleapp/1.0",\n    "resultPath" : "/premruleapp/1.0",\n    "operationType" : "UPDATE"\n  }, {\n    "initialPath" : "/premruleapp/1.0/scrubnewclaim/1.0",\n    "resultPath" : "/premruleapp/1.0/scrubnewclaim/1.295",\n    "operationType" : "CHANGE_VERSION_AND_ADD",\n    "managedXomGeneratedProperty" : "reslib://premruleapp_1.0/1.3,"\n  }, {\n    "type" : "LIB",\n    "initialPath" : "/premruleapp_1.0/1.0",\n    "resultPath" : "/premruleapp_1.0/1.3",\n    "operationType" : "ALREADY_PRESENT"\n  } ]\n}',
      name: 'UploadRuleAppToProdWest',
      message:
        'Ruleapp version updated from /premruleapp/1.0/scrubnewclaim/1.0 to /premruleapp/1.0/scrubnewclaim/1.295',
      ordering: '10',
      action: 'Upload to RES in Prod-West',
      category: null,
      id: '1098',
    },
  ],
  dcUrl: 'https://odmdc.dev.claimrules.aws.athenahealth.com/decisioncenter-api',
  id: '221',
  archiveFileName: 'claims-service-20210428141254.jar',
  tasks: [
    {
      legacyRuleId: '1.956',
      taskTypeName: 'Dual Update',
      businessRequirementName: 'Add Attachment Stub',
      name: 'Test Task  144',
      id: '535',
      businessRequirementId: '85',
      taskTypeId: '3',
    },
    {
      legacyRuleId: '1.956',
      taskTypeName: 'Business Requirement Update',
      businessRequirementName: 'Add Attachment Stub',
      name: 'Test Task  139',
      id: '530',
      businessRequirementId: '85',
      taskTypeId: '1',
    },
  ],
  archiveFilePath:
    'http://artifactory.aws.athenahealth.com:80/libs-snapshot-local/com/athenahealth/claimrules/testing-odm-rule-app-archive//claims-service-20210428141254.jar',
  version: '4',
  name: 'R2 Deployment',
  description: null,
  created: '04/28/2021',
  deploymentConfigName: 'DEV_Prem',
  releaseVersion: null,
  envs: [
    {
      statusId: '1',
      resUrl: 'https://odmds.dev.claimrules.aws.athenahealth.com',
      version: '2',
      name: 'Prod-Mirror',
      resultVersion: '1.293',
      id: '213',
      initialVersion: '1.0',
    },
    {
      statusId: '1',
      resUrl: 'https://odmds.dev.claimrules.aws.athenahealth.com',
      version: '2',
      name: 'Prod-East',
      resultVersion: '1.294',
      id: '214',
      initialVersion: '1.0',
    },
    {
      statusId: '1',
      resUrl: 'https://odmds.dev.claimrules.aws.athenahealth.com',
      version: '2',
      name: 'Prod-West',
      resultVersion: '1.295',
      id: '215',
      initialVersion: '1.0',
    },
  ],
};
