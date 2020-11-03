import React, { useState } from 'react'
import { Typography, Form, Input, Button, Icon} from 'antd'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import { useSelector } from 'react-redux'

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

function VideoUploadPage(props) {

    // 리덕스의 state 스토어에 가서 user 정보를 선택
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Privacy, setPrivacy] = useState(0)
    const [Category, setCategory] = useState('Film & Animation')
    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [ThumbnailPath, setThumbnailPath] = useState('')

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
            thumbnail: ThumbnailPath
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
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
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    
                    {/* Drop Zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>
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
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                    
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

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default VideoUploadPage
