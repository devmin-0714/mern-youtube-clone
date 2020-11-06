# react-youtube-clone

- 출처 : [John Ahn님 GitHub](https://github.com/jaewonhimnae)

---

## 0. 초기 설정

- [boiler-plate 클론](https://github.com/jaewonhimnae/boilerplate-mern-stack)

- `클라이언트`와 `서버`에 `Dependencies` 다운받기

  - `npm install`
  - `Server`은 **Root** 경로, `Client`는 **client폴더** 경로

- `server/config/dev.js` 파일 설정
  - `MongoDB` 로그인
  - 클러스터, 유저 아이디와 비밀번호 생성 후 `dev.js` 파일에 넣는다.

```js
// server/config/dev.js
module.exports = {
  mongoURI:
    'mongodb+srv://blackb0x0714:<password>@react-movie-app.nh8wh.mongodb.net/<dbname>?retryWrites=true&w=majority',
}
```

---

## 1. 비디오 업로드 FORM 만들기

- **Upload Page 만들기**
- **Upload Page Route 만들기**
- **Upload Page Header Tab 만들기**
- **From Template 만들기**
- **파일을 올리는 Template 만들기 위해 Drop-zone 다운받기**
  - `npm install react-dropzone --save` (`Client` 경로)
  - [react-dropzone](https://www.npmjs.com/package/react-dropzone)
- **onChange func 만들기**

```js
// App.js
import VideoUploadPage from './views/VideoUploadPage/VideoUploadPage'
function App() {
  return (
        <Switch>
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
        </Switch>
  )
}

// NavBar/Sections/RightMenu.js
function RightMenu(props) {
if (user.userData && !user.userData.isAuth) {
    ...
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/video/upload">Video</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}

// VideoUploadPage.js
import React, { useState } from 'react'
import { Typography, Form, Input, Button, Icon} from 'antd'
import Dropzone from 'react-dropzone'

const { Title } = Typography
const { TextArea } = Input

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CatogoryOptions = [
    { value: 0, label: 'Film & Animation' },
    { value: 1, label: 'Autos & Vehicles' },
    { value: 2, label: 'Music' },
    { value: 3, label: 'Pets & Animals' },
    { value: 4, label: 'Sports' }
]

function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState('');
    const [Description, setDescription] = useState('');
    const [Privacy, setPrivacy] = useState(0)
    const [Category, setCategory] = useState('Film & Animation')

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivacy(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    {/* Drop Zone */}
                    <Dropzone
                        onDrop
                        multiple
                        maxSize>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    <div>
                        <img />
                    </div>
                </div>

                <br />
                <br />

                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />

                <br />
                <br />

                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />

                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CatogoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default VideoUploadPage
```

---

## 2. Multer로 노드 서버에 비디오 저장하기

- **onDrop func 만들기**
- **노드 서버에 파일을 저장하기 위해 Dependency를 먼저 다운로드**
  - `npm install multer --save` (`Server` 경로)
  - [multer](https://www.npmjs.com/package/multer)
- **비디오 파일을 서버로 보내기**
- **받은 비디오 파일을 서버에서 저장**
- **파일 저장 경로를 클라이언트로 전달해 주기**

```js
// VideoUploadPage.js
import Dropzone from 'react-dropzone'
import axios from 'axios'

function VideoUploadPage() {
  const onDrop = (files) => {
    let formData = new FormData()
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    }

    formData.append('file', files[0])

    axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data)
      } else {
        alert('비디오 업로드를 실패했습니다.')
      }
    })
  }

  return (
    <Form onSubmit>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Drop Zone */}
        <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
          {({ getRootProps, getInputProps }) => (
            <div
              style={{
                width: '300px',
                height: '240px',
                border: '1px solid lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Icon type="plus" style={{ fontSize: '3rem' }} />
            </div>
          )}
        </Dropzone>
      </div>
    </Form>
  )
}

// server/index.js
app.use('/api/video', require('./routes/video'))

// server/routes/video.js
const express = require('express')
const router = express.Router()
const multer = require('multer')

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
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false)
    }
    cb(null, true)
  },
})

var upload = multer({ storage: storage }).single('file')

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    })
  })
})

module.exports = router
```

---

## 3. ffmpeg로 비디오 썸네일 생성하기

- **썸네일 생성을 위한 Dependency를 다운 받기**
  - `fluent-ffmpeg` 를 다운 받기 위한 필수조건
  - `brew install ffmpeg`
    - [설치방법](https://ai-creator.tistory.com/78)
  - `npm install fluent-ffmpeg --save` (`Server` 경로)
- **서버에 저장된 비디오를 이용한 썸네일 생성**
- **생성된 썸네일을 서버에 저장**
- **썸네일 이미지 파일 경로 정보를 클라이언트에 보내기**
- **썸네일 이미지를 화면에 표시**

```js
// VideoUploadPage.js
function VideoUploadPage() {

    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [ThumbnailPath, setThumbnailPath] = useState('')

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        // 비디오 업로드
        axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if (response.data.success) {

                let variable = {
                    filePath: response.data.filePath,
                    fileName: response.data.fileName
                }

                setFilePath(response.data.filePath)

                // filepath를 이용해 썸네일 만들기
                axios.post('/api/video/thumbnail', variable)
                    .then(response => {
                        if (response.data.success) {
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.thumbsFilePath)
                        } else {
                            alert('썸네일 생성에 실패했습니다.');
                        }
                    })

            } else {
                alert('비디오 업로드를 실패했습니다.')
            }
        })
    }

    return (

        {/* Thumbnail */}
        {ThumbnailPath &&
            <div>
                <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
            </div>
        }
    )
}

// server/routes/video.js
var ffmpeg = require('fluent-ffmpeg')
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
```

---

## 4. 비디오 업로드 하기

- **비디오 Collection을 만든다**

  - `writer`, `title`, `description`, `privacy`, `filePath`, `category`, `views`, `duration`, `thumbnail`

- **onSubmit Function을 만든다**
- **요청할 데이터들을 서버로 보낸다**
- **보낸 데이터들을 MongoDB에 저장한다**

  - `RDBMS/MongoDB` - `Database/Database` - `Tables/Collections` - `Rows/Documents` - `Columns/Fields`

```js
// server/models/Vidoe.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
)

const Video = mongoose.model('Video', videoSchema)

module.exports = { Video }

// VideoUploadPage.js
import { useSelector } from 'react-redux'

function VideoUploadPage(props) {
  // 리덕스의 state 스토어에 가서 user 정보를 선택
  const user = useSelector((state) => state.user)

  const onSubmit = (e) => {
    e.preventDefault()

    // Video Collention에 모두 넣기 위해
    const variables = {
      // 리덕스의 State에서 확인 가능 (user.userData)
      // react-redux의 useSelector를 이용
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Privacy,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    }

    axios.post('/api/video/uploadVideo', variables).then((response) => {
      if (response.data.success) {
        alert('성공적으로 업로드를 했습니다.')
        setTimeout(() => {
          props.history.push('/')
        }, 3000)
      } else {
        alert('비디오 업로드에 실패했습니다.')
      }
    })
  }
  return (
    <Form onSubmit={onSubmit}>
      <Button type="primary" size="large" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  )
}

// server/routes/video.js
const { Video } = require('../models/Video')

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보를 mongoDB에 저장한다

  const video = new Video(req.body)

  video.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})
```

---

## 5. 랜딩 페이지에 비디오들 나타나게 하기

- **빈 랜딩 페이지 생성**
- **비디오 카드 Template 만들기**
- **몽고 DB에서 모든 비디오 데이터 가져오기**
  - `useEffect` : `DOM`이 로드 되자마자 무엇을 할것인지

```js
// server/models/Video.js
writer: {
type: Schema.Types.ObjectId,
ref: 'User'
}

// LandingPage.js
Video.find().populate('writer')
```

- **가져온 비디오 데이터들을 스크린에 출력하기**
  - `Use map() methods`

```js
// LandingPage.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Card, Avatar, Col, Typography, Row } from 'antd'

const { Title } = Typography
const { Meta } = Card

function LandingPage() {

    const [Video, setVideo] = useState([])

    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setVideo(response.data.videos)
                } else {
                    alert('비디오를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`} >
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className="duration">
                      <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views} views</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />

            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage


// server/routes/video.js
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
      if (err) return res.status(400).send(err)
      res.status(200).json({ success: true, videos })
    })
})

// client/src/index.css
// 비디오 시간 CSS
.duration {
  bottom: 0;
  right: 0;
  position: absolute;
  margin: 4px;
  color: #fff;
  background-color: rgba(17, 17, 17, 0.8);
  opacity: 0.8;
  padding: 2px 4px;
  border-radius: 2px;
  letter-spacing: 0.5px;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
}
```

---

## 6. 비디오 디테일 페이지 만들기

- **비어있는 비디오 디테일 페이지 생성**
- **비디오 디테일 페이지를 위한 Route 만들기**
- **비디오 디테일 페이지 Template 만들기**
- **MongoDB에서 비디오 데이터 가져오기**
- **가져온 데이터들을 스크린에 출력한다**

```js
// App.js
import VideoDetailPage from './views/VideoDetailPage/VideoDetailPage'
function App() {
  return (
    <Switch>
      <Route
        exact
        path="/video/:videoId"
        component={Auth(VideoDetailPage, null)}
      />
    </Switch>
  )
}

// VideoDetailPage.js
import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd'
import axios from 'axios'

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId
  const variable = { videoId: videoId }

  const [VideoDetail, setVideoDetail] = useState([])

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.videoDetail)
      } else {
        alert('비디오 정보를 가져오길 실패했습니다.')
      }
    })
  }, [])

  if (VideoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4em' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            ></video>
            <List.Item actions>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
          </div>
        </Col>
        Side Videos
        <Col lg={6} xs={24}></Col>
      </Row>
    )
  } else {
    return <div>...loading</div>
  }
}

export default VideoDetailPage

// server/routes/video.js
router.post('/getVideoDetail', (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate('writer')
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err)
      res.status(200).json({ success: true, videoDetail })
    })
})
```

---

## 7. 디테일 비디오 페이지에 Side 비디오 생성

- **Side Video 부분 Layout template 만들기**
- **한개의 카드 template 만들기**
- **DB에서 모든 비디오 데이터를 불러오기**
- **불러온 데이터 화면에 출력하기**

```js
// VideoDetailPage.js
import SideVideo from './Sections/SideVideo'

    return (
      <Col lg={6} xs={24}>
        <SideVideo />
      </Col>
    )
}

// VideoDetailPage/Sections/SideVideo.js
import React, {useEffect, useState} from 'react'
import axios from 'axios'

function SideVideo() {

    const [SideVideos, setSideVideos] = useState([])

    useEffect(() => {
        axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setSideVideos(response.data.videos)
                } else {
                    alert('비디오를 가져오는데 실패했습니다.')
                }
            })
    }, [])

    const renderSideVideo = SideVideos.map(( video, index) => {

        var minutes = Math.floor(video.duration / 60)
        var seconds = Math.floor(video.duration - minutes * 60)

       return <div key={index} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
        <div style={{ width:'40%', marginRight:'1rem' }}>
            <a href>
                <img
                style={{ width: '100%' }}
                src={`http://localhost:5000/${video.thumbnail}`}
                alt="thumbnail" />
            </a>
        </div>

        <div style={{ width:'50%' }}>
            <a href style={{ color:'gray' }}>
                <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}  </span><br />
                <span> {video.writer.name} </span><br />
                <span> {video.views} views </span><br />
                <span> {minutes} : {seconds} </span><br />
            </a>
        </div>
    </div>
    })

    return (
        <React.Fragment>
            <div style={{ marginTop:'3rem' }}></div>

            {renderSideVideo}

        </React.Fragment>
    )
}

export default SideVideo
```

---

## 8. 구독 기능

- **Subscriber Model 만들기**
  - `userTo`, `userFrom`
- **Subscribe Button UI 만들기**
- **데이터베이스에서 얼마나 많은 사람이 비디오 업로드 한 유저를 구독하는지 정보 가져오기**
- **내가 이 비디오 업로드 한 유저를 구독하는지 정보 가져오기**
- **가져온 정보를 화면에 출력**

```js
// server/models/Subscriber.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

const Subscriber = mongoose.model('Subscriber', subscriberSchema)

module.exports = { Subscriber }

// VideoDetailPage.js
import Subscriber from './Sections/Subscriber'

    return (
      <List.Item
          actions={[<Subscriber userTo={VideoDetail.writer._id} />]} >
      </List.Item>
    )
}

// VideoDetailPage/Sections/Subscriber.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Subscriber(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {

        // userTo : VideoDetailPage.js의 userTo={VideoDetail.writer._id}
        const variable = { userTo: props.userTo }

        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 가져오지 못했습니다.')
                }
            })

        // userFrom : 개발자도구 - Application - Local Storage - userId
        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if (response.data.success) {
                setSubscribed(response.data.subcribed)
            } else {
                alert('구독 정보를 가져오지 못했습니다.')
            }
        })

    }, [])

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px', fontWeight: '500',
                    fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscriber

// server/index.js
app.use('/api/subscribe', require('./routes/subscribe'))

// server/routes/subscribe.js
const express = require('express');
const router = express.Router();


const { Subscriber } = require('../models/Subscriber')

const { auth } = require("../middleware/auth")

//=================================
//             Subscribe
//=================================


router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length  })
    })

})

router.post('/subscribed', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo , 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)

        let result = false;
        if(subscribe.length !== 0) {
            result = true
        }

        res.status(200).json({ success: true, subcribed: result })
    })

})

module.exports = router
```

- **구독하기 기능 만들기**
- **구독 취소하기 기능 만들기**

```js
// VideoDetailPage
    return (
      <List.Item
        actions={[<Subscriber
          userTo={VideoDetail.writer._id}
          userFrom={localStorage.getItem('userId')} />]}
        >
      </List.Item>
    )
}

// VideoDetailPage/Sections/Subscriber.js
function Subscriber(props) {

  const onSubscribe = ( ) => {

        let subscribeVariables = {
                userTo : props.userTo,
                userFrom : props.userFrom
        }

        // 이미 구독 중이라면
        if(Subscribed) {

            axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독을 취소하는데 실패했습니다.')
                    }
                })

        // 구독중이지 않다면
        } else {

            axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독하는데 실패했습니다.')
                    }
                })
        }

    }
  return (
    <button
        onClick={onSubscribe} >
    </button>

// server/routes/subscribe.js
router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc)=>{
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, doc })
        })
})

router.post('/subscribe', (req, res) => {

    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })

})
```

---

## 9. 구독 비디오 페이지

- **빈 Subscription 페이지 생성**
- **Subscription 페이지를 위한 Route 만들기**
- **Template 만들기**
- **내가 구독한 유저의 비디오들만 서버에서 가져오기**
- **가져온 비디오 데이터들을 화면에 출력하기**

```js
// App.js
import SubscriptionPage from './views/SubscriptionPage/SubscriptionPage'

;<Switch>
  <Route exact path="/subscription" component={Auth(SubscriptionPage, null)} />
</Switch>

// NavBar/Sections/LeftMenu.js
<Menu.Item key="subscription">
      <a href="/subscription">Subscription</a>
    </Menu.Item>

// SubscriptionPage.js
import React, { useEffect, useState } from 'react'
import { Card, Avatar, Col, Typography, Row } from 'antd'
import axios from 'axios'
import moment from 'moment'

const { Title } = Typography
const { Meta } = Card

function SubscriptionPage() {

    const [Videos, setVideos] = useState([])

    useEffect(() => {

        const subscriptionVariables = {
            userFrom: localStorage.getItem('userId')
        }

        axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
            .then(response => {
                if (response.data.success) {
                    setVideos(response.data.videos)
                } else {
                    alert('구독한 비디오를 가져오는데 실패했습니다.')
                }
            })
    }, [])


    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`} >
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className="duration">
                      <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views} views</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />

            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage

// server/routes/video.js
const { Subscriber } = require('../models/Subscriber')
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
```

---

## 10. 댓글 기능 생성

### 10-1. System Explained

- **댓글 부분 구조 (Comment.js)**
  - `SingleComment.js` : `USER INFO`, `CONTENT`, `COMMENT FORM`, `ACTIONS (LIKES & DISLIKES, REPLT TO)`
  - `ReplyComment.js` : `<SingleComment />`, `<ReplyComment />`
  - `ROOT COMMENT FORM`
- **Comment model 생성**
  - `writer`, `postId`, `responseTo`, `content`
- **디테일 비디오 페이지에 Comment Component 만들기**

```js
// VideoDetailPage.js
import Comment from './Sections/Comment'

  return (
    {/* Comments */}
    <Comment />
)

// VideoDetailPage/Sections/Comment.js
import React from 'react'

function Comment() {
    return (
        <div>
            Comment
        </div>
    )
}

export default Comment

// server/models/Comment.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema)

module.exports = { Comment }
```

### 10-2. Comment.js

- **Comment js.를 위한 template 만들기**
- **handleChange func 만들기**
- **onSubmit func 만들기**
- **저장된 댓글 데이터를 Parent Component(VideoDetailPage.js)로 업데이트 하기**
- **콘솔창에서 댓글 리스트들 확인**
  - SingleComment.js : props.refreshFunction
  - Comment.js : props.refreshFunction
  - VideoDetailPage.js : loadComments

```js
// VideoDetailPage.js
import Comment from './Sections/Comment'

const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

  return (
    {/* Comments */}
    <Comment postId={videoId} refreshFunction={refreshFunction}/>
)

// VideoDetailPage/Sections/Comment.js
import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

function Comment(props) {

    const videoId = props.postId
    // useSelector를 사용하여 writer state를 리덕스에서 가져오기
    const user = useSelector(state => state.user)

    const [commentValue, setcommentValue] = useState('')

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            content: commentValue,
            // useSelector를 사용하여 writer state를 리덕스에서 가져오기
            writer: user.userData._id,
            postId: props.videoId
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })

    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* Comment Lists */}

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }}
                onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment

// server/index.js
app.use('/api/comment', require('./routes/comment'))

// server/routes/comment.js
const express = require('express')
const router = express.Router()

const { Comment } = require('../models/Comment')

//=================================
//             Subscribe
//=================================

router.post('/saveComment', (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })

        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

})

module.exports = router
```

### 10-3. SingleComment

- **Comment.js에 SingleComment Component를 생성**
- **SingleComment를 위한 Template 생성**
- **Open Reply function과 handleChange function 만들기**
- **onSubmit function 만들기**
- **모든 Comment 정보들을 데이터 베이스에서 가져오기**
- **저장된 댓글을 Parent Component에다가 업데이트**

```js
// VideoDetailPage.js
import Comment from './Sections/Comment'

function VideoDetailPage(props) {

  const [Comments, setComments] = useState([])

  useEffect(() => {

        axios.post('/api/comment/getComments', variable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)
                    console.log(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오길 실패했습니다.')
                }
            })


    }, [])

  const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

  return (
    {/* Comments */}
    <Comment postId={videoId} refreshFunction={refreshFunction}/>
  )

}

// VideoDetailPage/Sections/Comment.js
function Comment(props) {
  ...
    return (
        {/* Comment Lists */}
        {props.commentLists && props.commentLists.map((comment, index) => (
            (!comment.responseTo &&
                <SingleComment
                postId={videoId}
                refreshFunction={props.refreshFunction}
                comment={comment} />
            )
        ))}
    )
}

// VideoDetailPage/Sections/SingleComment.js
import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import axios from 'axios'
import { useSelector } from 'react-redux'

const { TextArea } = Input

function SingleComment(props) {

    // useSelector를 사용하여 writer state를 리덕스에서 가져오기
    const user = useSelector(state => state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState('')

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            content: CommentValue,
            // useSelector를 사용하여 writer state를 리덕스에서 가져오기
            writer: user.userData._id,
            postId: props.postId,
            responseTo : props.comment._id
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })

    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to </span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p> {props.comment.content} </p>}
            />

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }}
                    onClick={onSubmit}>Submit</button>
                </form>
            }

        </div>
    )
}

export default SingleComment

// server/routes/comment.js
router.post('/getComments', (req, res) => {

    Comment.find({ "postId": req.body.videoId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, comments })
        })

})
```

### 10-4. ReplyComment

- **ReplyComment Component를 Comment.js에 만들기**
- **ReplyComment Template 만들기**
- **자식 코멘트 수 구하기**
- **Complete Comment System**

```js
// VideoDetailPage/Sections/Comment.js
function Comment(props) {
  ...
    return (
        {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment postId={videoId}
                        refreshFunction={props.refreshFunction}
                        comment={comment} />

                        <ReplyComment postId={videoId}
                        refreshFunction={props.refreshFunction}
                        parentCommentId={comment._id}
                        commentLists={props.commentLists}/>
                    </React.Fragment>
                )
            ))}
    )
}

// VideoDetailPage/Sections/ReplyComment.js
import React, { useEffect, useState } from 'react'
import SingleComment from '../Sections/SingleComment'

function ReplyComment(props) {


    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {

        let commentNumber = 0

        props.commentLists.map((comment) => {

            if(comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }

        })

        setChildCommentNumber(ChildCommentNumber)

    }, [props.commentLists])

    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment postId={props.videoId}
                        refreshFunction={props.refreshFunction}
                        comment={comment} />

                        <ReplyComment postId={props.videoId}
                        refreshFunction={props.refreshFunction}
                        parentCommentId={comment._id}
                        commentLists={props.commentLists}/>
                    </div>
                }
            </React.Fragment>
        ))

        const onHandleChange = () => {
            setOpenReplyComments(!OpenReplyComments)
        }


    return (
        <div>

            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View 1 more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment

// VideoDetailPage/Sections/SingleComment.js
function SingleComment(props) {

  const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            content: CommentValue,
            // useSelector를 사용하여 writer state를 리덕스에서 가져오기
            writer: user.userData._id,
            postId: props.postId,
            responseTo : props.comment._id
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue('')
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 저장하지 못했습니다.')
                }
            })

    }
```
