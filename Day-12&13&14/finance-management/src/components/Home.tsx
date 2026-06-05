import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Home = () => {
    let navigator = useNavigate()
    return (
        <>
        <h1>HOME</h1>
        <Button className="btn btn-danger" onClick={() => {
            localStorage.removeItem("userInfo")
            navigator("/login")
        }}>Logout</Button>
        </>
    )
}

export default Home;