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
