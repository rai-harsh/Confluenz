import React from "react";
import List from "../Components/List"
import axios from "axios";
import { useEffect } from "react";

export default function Events(){
    const [locations,setLocations]= React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    useEffect(() => {
    axios.get("/api/events")
        .then((response) => {
        setLocations(response.data);
        setLoading(false);
        })
        .catch((error) => {
        console.error(error);
        setError("Error fetching data");
        setLoading(false);
        });
    }, []);
    
    return(
        <>
            <div className="flex flex-col items-center lg:py-28 md:py-20 sm:py-12 py-7 bg-gray-100">
                {
                    loading || error || locations.map((item)=>{
                        return(
                        <List  
                            key={item.id}
                            id={item.id}
                            venue={item.venue}
                            name={item.name}
                            date={item.date.slice(0,10)}
                            source={`http://localhost:4000${item.cover_img}`}
                        />
                        )
                    })
                }
            </div>
        </>
    )
}   