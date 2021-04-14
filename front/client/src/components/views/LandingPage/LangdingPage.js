import React, {useEffect} from 'react'
import axios from 'axios'

function Landingpage(){

    useEffect(() => {
        axios.get('/api/hello')
            .then(res => console.log(res.data));
    }, [])

    return(
        <div>
            Landingpage
        </div>
    )
}

export default Landingpage;