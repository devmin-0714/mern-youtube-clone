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

        let subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom }
        // 잘못된 코드 : let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}
        // 다른 방법 : 
        // const userTo = props.userTo
        // const userFrom = props.userFrom
        // let subscribedVariable = { userTo: userTo, userFrom: userFrom }

        axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if (response.data.success) {
                setSubscribed(response.data.subcribed)
            } else {
                alert('구독 정보를 가져오지 못했습니다.')
            }
        })

    }, [])

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
        <div>
            <button 
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px', fontWeight: '500',
                    fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscriber