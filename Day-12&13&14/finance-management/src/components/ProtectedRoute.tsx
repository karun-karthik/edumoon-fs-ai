import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
    const navigator = useNavigate()

    useEffect(() => {
        const userData = localStorage.getItem("userInfo");
        if (userData == null) {
            navigator("/login")
        }
    }, [navigator])

    return <Outlet/>
}

export default ProtectedRoute;