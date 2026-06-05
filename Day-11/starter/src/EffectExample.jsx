import { useEffect, useState } from "react";

// const EffectExample = () => {

//     const [count, setCount] = useState(0);
//     const [count1, setCount1] = useState(0);

//     // // no dependency array, my useEffect runs after every render
//     // useEffect(() => {
//     //     console.log("Count is ", count)
//     //     document.title = `Count: ${count}`
//     // })

//     // this use-effect is triggered only once during the component mount
//     useEffect(() => {
//         console.log("This occurs only once")
//     }, [])

//     // dependency array can have either state or props as keys
//     useEffect(() => {
//         console.log("Count is ", count)
//         document.title = `Count: ${count}`
//     }, [count]) 

//     return (
//         <>
//             <div>Count: {count}</div>
//             <div>Count1: {count1}</div>
//             <button onClick={() => setCount(c => c+1)}>Increment Count</button>
//             <button onClick={() => setCount1(c => c+1)}>Increment Count1</button>
//         </>
//     )
// }

const UserDetail = ({user, handleClear}) => {

    useEffect(() => {
        console.log("UserDetail is mounted")

        return () => {
            console.log("UserDetail is unmounted")
        }
    })
    return (
        <>
            <button onClick={handleClear}>Clear</button>
            <p>Email: {user.email}</p>
        </>
    )
}

const EffectExample = () => {

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
        .then( response => {
            if (!response.ok)   throw new Error('Failed to fetch')
            return response.json()
        })
        .then(data => {
            setUsers(data);
            setIsLoading(false);
        }).catch(err => {
            setError(err.message);
            setIsLoading(false)
        })
    }, [])

    if (isLoading)  return <><p>Loading....</p></>
    if (error)  return <><p>Error: {error}</p></>

    return (
        <>
            <ul>
                {users.map(user => {
                    return <li key={user.id} onClick={() => setDetails(user)}>{user.name}</li>
                })}
            </ul>
            {details ? <UserDetail user={details} handleClear={() => setDetails(null)} /> : <></>}
            
        </>
    )
}

export default EffectExample;