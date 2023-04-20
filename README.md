# <u>SignalsAndSorcery</u>

SignalsAndSorcery is an open source WebAudioApi powered audio loops composer.  This VueJS application is the frontend for the online audio stems platform [SignalsAndSorcery.ai](https://signalsandsorcery.ai). It pulls content from any endpoint serving MrTap [Music-Runtime-Assembly-Protocol](https://github.com/shiehn/MrTAP) formatted JSON.  It enables user to arrange audio stems/loops in browser and download the results as audio files or popular DAW project files.  

![Screen Shot](https://sas-plugin-releases.s3.us-west-2.amazonaws.com/github-app-screenshot.png)

---

#### SETUP:

```yarn install```

#### TEST:

```yarn test``` 

#### BUILD:

```yarn build```

#### RUN LOCALLY:

```yarn serve```

#### VIEW IN BROWSER:

```http://localhost:8080/```

# <u>SignalsAndSorcery Server Pipeline</u>

The server pipeline is not part of this repo but the client pulls from the pipeline server. This info-graph provides a high level overview.  The pipeline generates samples and permutations through a variety of techniques. 

![sas-pipeline-design](https://sas-plugin-releases.s3.us-west-2.amazonaws.com/sas-pipeline-design.png)
