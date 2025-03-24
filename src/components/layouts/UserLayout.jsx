import React from "react";
import { Outlet } from "react-router-dom";
import HeaderBar from "../common/HeaderBar";
import Spinner from "../common/Spinner";
import { useUser } from "@/services/UserContext";

const UserLayout = () => {
    const { user, profileImageUrl, loadingUser } = useUser();

    return (
        <>
            {!loadingUser && user ? (
                <>
                    <HeaderBar user={user} profileImage={profileImageUrl} />
                    <main className="mt-16">
                        <Outlet />
                    </main>
                </>
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default UserLayout;