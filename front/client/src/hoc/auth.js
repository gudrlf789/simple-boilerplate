import React, { useEffect } from 'react';
import {useDispatch} from  'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){

    /*
    option 파라미터의 종류
    1.null => 아무나 출입이 가능한 페이지
    2.true => 로그인한 유저만 출입이 가능한 페이지
    3.false => 로그인한 유저는 출입이 불가능한 페이지
    */

    function AuthenticationCheck(props){

        const dispatch = useDispatch()
        
        useEffect(() => {

            dispatch(auth()).then(res => {
                //로그인 하지 않은 상태
                if(!res.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                }else{
                    //로그인 한 상태
                    if(adminRoute && !res.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false){
                            props.history.push('/')
                        }
                    }
                }
            })

        }, [])

        return(
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}