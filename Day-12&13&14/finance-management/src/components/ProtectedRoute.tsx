import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
    const navigator = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            navigator("/login")
        }
    }, [navigator])

    return <Outlet/>
}

export default ProtectedRoute;