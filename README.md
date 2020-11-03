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
