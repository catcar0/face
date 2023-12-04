'use strict';

const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const { v4: uuid } = require('uuid');

const key = 'c2d1f6017378425e915959ba448369fd';
const endpoint = 'https://faceyoung.cognitiveservices.azure.com/';

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);


const image_base_url = "";
// const image_base_url = "http://47.94.44.34/statics/personGroup/";
let person_group_id
let personname = ''
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function DetectFaceRecognize(url) {
    // Detect faces from image URL. Since only recognizing, use the recognition model 4.
    // We use detection model 3 because we are only retrieving the qualityForRecognition attribute.
    // Result faces with quality for recognition lower than "medium" are filtered out.
    // 从图像 URL 检测人脸。由于仅识别，因此使用识别模型 4.
    // 我们使用检测模型 3，因为我们只检索 qualityForRecognition 属性。
    // 识别质量低于“中等”的结果人脸将被过滤掉。
    let detected_faces = await client.face.detectWithUrl(url,
        {
            detectionModel: "detection_03",
            recognitionModel: "recognition_04",
            returnFaceAttributes: ["QualityForRecognition"]
        });
    return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium' || face.faceAttributes.qualityForRecognition == 'low');
}

async function AddFacesToPersonGroup(person_dictionary, person_group_id) {
    console.log ("Adding faces to person group...");
    // The similar faces will be grouped into a single person group person.相似的面孔将被分组到一个人的群体中
    
    await Promise.all (Object.keys(person_dictionary).map (async function (key) {
        const value = person_dictionary[key];


        let person = await client.personGroupPerson.create(person_group_id, { name : key });
        console.log("Create a persongroup person: " + key + ".");

        // Add faces to the person group person.向人员组人员添加人脸
        await Promise.all (value.map (async function (similar_image) {

            // Wait briefly so we do not exceed rate limits.
            await sleep (1000);


            // Check if the image is of sufficent quality for recognition.检查图像质量是否足以识别
            let sufficientQuality = true;
            console.log(similar_image)
            let detected_faces = await client.face.detectWithUrl(image_base_url + similar_image,
                {
                    returnFaceAttributes: ["QualityForRecognition"],
                    detectionModel: "detection_03",
                    recognitionModel: "recognition_03"
                });
            detected_faces.forEach(detected_face => {
                if (detected_face.faceAttributes.qualityForRecognition != 'high'){
                    sufficientQuality = false;
                }
            });

            // Wait briefly so we do not exceed rate limits.
            await sleep (1000);

            // Quality is sufficent, add to group.质量足够，加入组
            if (sufficientQuality){
                console.log("Add face to the person group person: (" + key + ") from image: " + similar_image + ".");
                await client.personGroupPerson.addFaceFromUrl(person_group_id, person.personId, image_base_url + similar_image);
            }
            // Wait briefly so we do not exceed rate limits.
            await sleep (1000);
        }));
    }));

    console.log ("Done adding faces to person group.");
}

async function WaitForPersonGroupTraining(person_group_id) {
    // Wait so we do not exceed rate limits.
    console.log ("Waiting 3 seconds...");
    await sleep (3000);
    let result = await client.personGroup.getTrainingStatus(person_group_id);
    console.log("Training status: " + result.status + ".");
    if (result.status !== "succeeded") {
        await WaitForPersonGroupTraining(person_group_id);
    }
}

/* NOTE This function might not work with the free tier of the Face service
because it might exceed the rate limits. If that happens, try inserting calls
to sleep() between calls to the Face service.注意：此函数可能不适用于人脸服务的免费层
因为它可能会超出速率限制。如果发生这种情况，请尝试插入调用
to sleep（） 在调用人脸服务之间。
*/
async function IdentifyInPersonGroup(dictionary, base_url, ori_url) {
    console.log("========IDENTIFY FACES========");
    console.log(base_url);

// Create a dictionary for all your images, grouping similar ones under the same key.为所有图像创建一个字典，将相似的图像分组到同一个键下
    const person_dictionary = dictionary;

    // A group photo that includes some of the persons you seek to identify from your dictionary.一张合影，其中包括您希望从字典中识别的一些人
    let source_image_file_name = ori_url;

    
    // Create a person group. 创建人员组
    console.log("Creating a person group with ID: " + person_group_id);
    await client.personGroup.create(person_group_id, person_group_id, {recognitionModel : "recognition_04" });

    await AddFacesToPersonGroup(person_dictionary, person_group_id);

    // Start to train the person group.开始训练人员组
    console.log();
    console.log("Training person group: " + person_group_id + ".");
    await client.personGroup.train(person_group_id);

    await WaitForPersonGroupTraining(person_group_id);
    console.log();

    // Detect faces from source image url and only take those with sufficient quality for recognition.从源图像 url 中检测人脸，并仅获取具有足够质量的人脸进行识别
    let face_ids = (await DetectFaceRecognize(base_url)).map (face => face.faceId);
    
    // Identify the faces in a person group.识别人员组中的人脸
    let results = await client.face.identify(face_ids, { personGroupId : person_group_id});
    await Promise.all (results.map (async function (result) {
        try{
            let person = await client.personGroupPerson.get(person_group_id, result.candidates[0].personId);

            console.log("Person: " + person.name + " is identified for face in: " + source_image_file_name + " with ID: " + result.faceId + ". Confidence: " + result.candidates[0].confidence + ".");

            // Verification:
            let verifyResult = await client.face.verifyFaceToPerson(result.faceId, person.personId, {personGroupId : person_group_id});
            console.log("Verification result between face "+ result.faceId +" and person "+ person.name+ ": " +verifyResult.isIdentical + " with confidence: "+ verifyResult.confidence);
            personname = person.name
        } catch(error) {
            console.log("no persons identified for face with ID " + result.faceId);
            personname = ''
            console.log(error.toString());
        }
        
    }));
    console.log();
}

export default async function main(dictionary, base_url, ori_url) {
   person_group_id = uuid();
   await  IdentifyInPersonGroup(dictionary, base_url, ori_url);
   console.log ("Done.");
   return personname
}