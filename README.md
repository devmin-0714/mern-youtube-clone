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
