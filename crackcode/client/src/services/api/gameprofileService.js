import axios from "axios";

export const gameprofileService = () => {
    //Check if username is available
    const checkUsername = async (backendUrl, username) => {
        if (username.length < 3) return null;

        try {
            const { data } = await axios.get(`${backendUrl}/api/gameprofile/check-username/${username}`);
            return data.available;
        } catch (error) {
            console.error("Error checking username:", error);
            return null;
        }
    };

    //Update game-profile
    const updateGameprofile = async(backendUrl, getUserData,username,avatarData,avatarType) => {
        try{
            const{data} = await axios.put(`${backendUrl}/api/gameprofile/update`,{
                username,
                avatar: avatarData,
                avatarType
            });
            //refresh user infor after update
            if (data.success) getUserData();
            return data;
        }catch (error){
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return {checkUsername,updateGameprofile};
}