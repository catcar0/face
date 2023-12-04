const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
// const { v4: uuid } = require('uuid');

const key = 'c2d1f6017378425e915959ba448369fd';
const endpoint = 'https://faceyoung.cognitiveservices.azure.com/';

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);
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
export default async function identify(person_group_id, base_url) {
    let personname = ''
    // Detect faces from source image url and only take those with sufficient quality for recognition.从源图像 url 中检测人脸，并仅获取具有足够质量的人脸进行识别
    let face_ids = (await DetectFaceRecognize(base_url)).map(face => face.faceId);

    // Identify the faces in a person group.识别人员组中的人脸
    let results = await client.face.identify(face_ids, { personGroupId: person_group_id });
    await Promise.all(results.map(async function (result) {
        try {
            let person = await client.personGroupPerson.get(person_group_id, result.candidates[0].personId);

            // console.log("Person: " + person.name + " is identified for face in: " + source_image_file_name + " with ID: " + result.faceId + ". Confidence: " + result.candidates[0].confidence + ".");

            // Verification:
            let verifyResult = await client.face.verifyFaceToPerson(result.faceId, person.personId, { personGroupId: person_group_id });
            console.log("Verification result between face " + result.faceId + " and person " + person.name + ": " + verifyResult.isIdentical + " with confidence: " + verifyResult.confidence);
            personname = person.name
        } catch (error) {
            console.log("no persons identified for face with ID " + result.faceId);
            personname = ''
            console.log(error.toString());
        }

    }));
    return personname
}