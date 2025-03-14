import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchImage, fetchUserAccount } from "./AuthService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState("https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&flip=true");


    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchUserAccount();
                setUser(userData);
            } catch (error) {
                console.error("Failed to load user data in UserContext:", error);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        const loadProfileImage = async () => {
            // if (user?.profileImage !== null) {
            if (true) {
                try {
                    // const imageUrl = await fetchImage(user.profileImage);
                    const imageUrl = "https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&flip=true";
                    setProfileImageUrl(imageUrl);
                } catch (error) {
                    console.error("Failed to fetch profile image:", error);
                }
            }
        };

        if (user) {
            loadProfileImage();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, profileImageUrl, loadingUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

