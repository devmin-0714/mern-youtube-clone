const express = require('express');
const router = express.Router();
const multer = require('multer')
var ffmpeg = require('fluent-ffmpeg')

const { Video } = require('../models/Video')
const { Subscriber } = require('../models/Subscriber')
const { auth } = require('../middleware/auth')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },

    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

//=================================
//             Video
//=================================


router.post('/uploadfiles', (req, res) => {

    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true,
            filePath: res.req.file.path,
            fileName: res.req.file.filename
        })
    })

})

router.post('/thumbnail', (req, res) => {

    // **썸네일 생성하고 비디오 러닝타임도 가져오기**

    let thumbsFilePath = ''
    let fileDuration = ''

    // 비디오 러닝타임 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata) // all metadata
        console.log(metadata.format.duration)
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성
    ffmpeg(req.body.filePath)
        // 썸네일의 filename을 생성
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)
            thumbsFilePath = 'uploads/thumbnails/' + filenames[0]
        })
        // 썸네일 생성 후 처리
        .on('end', function () {
            console.log('Screenshots taken')
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration })
        })
        // 에러처리
        .on('error', function(err) {
            console.error(err)
            return res.json({ success: false, err })
        })
        // 옵션
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails/',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        })

})

router.post('/uploadVideo', (req, res) => {

    // 비디오 정보를 mongoDB에 저장한다

    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })

})

router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    Video.find()
        /* server/models/Video.js
        writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        } */
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videos })
        })

})

router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
    })
})

router.post('/getSubscriptionVideos', (req, res) => {

    // 1. 자신의 아이디를 가지고 Subscriber Collectionp에서 구독한 사람들을 찾는다.
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec(( err, subscriberInfo )=> {
        if(err) return res.status(400).send(err)

        // userTo의 정보를 모두 넣어준다.
        let subscribedUser = []

        subscriberInfo.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })

        // 2. 찾은 사람들의 비디오를 가지고 온다. 
        // 정보가 2개 이상일 때는 { writer : req.body.id } 가 사용되지 못한다.
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err)
                return res.status(200).json({ success: true, videos })
            })
    })
})



module.exports = router