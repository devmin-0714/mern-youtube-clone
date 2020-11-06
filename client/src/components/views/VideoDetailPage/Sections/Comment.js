import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

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
