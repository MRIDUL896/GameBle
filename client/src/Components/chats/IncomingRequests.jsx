import { useState,useEffect } from "react";
import api from '../axiosConfig'


const IncomingRequests = () => {
    const [reqList, setReqList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReq = async () => {
            try {
                const response = await api.get('/gameble/getRequests');
                setReqList(response.data); // assuming response.data holds the array of friends
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReq();
        console.log(reqList)
    }, []);

    return (
        <div>
            REQUESTS
        </div>
    )
}

export default IncomingRequests;