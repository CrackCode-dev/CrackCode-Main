import axios from "axios";

export const gameprofileService =  {
    //Check if username is available
    checkUsername : async (backendUrl, username) => {
        if (username.length < 3) return null;

        try {
            const token = typeof window !== 'undefined' && localStorage.getItem('accessToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const { data } = await axios.get(`${backendUrl}/api/gameprofile/check-username/${username}`, { headers });
            return data.available;
        } catch (error) {
            console.error("Error checking username:", error);
            return null;
        }
    },

    //Update game-profile
   updateGameprofile : async(backendUrl, getUserData,username,avatarData,avatarType) => {
        try{
            // Ensure Authorization header is set (fallback to stored token)
            const token = typeof window !== 'undefined' && localStorage.getItem('accessToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const{data} = await axios.put(`${backendUrl}/api/gameprofile/update`,{
                username,
                avatar: avatarData,
                avatarType
            }, { headers });
            //refresh user infor after update
            if (data.success) getUserData();
            return data;
        }catch (error){
            console.error("Error updating profile:", error);
            throw error;
        }
        
    }

   
};