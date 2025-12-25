import { Inngest } from "inngest";
import user from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "CrackCode" });

//Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async({event}) => {
        const {id, first_name, last_name, email_address, image_url} = event.data
        let username = email_address[0].email_address.split('@')[0]

        //check availability of username
        const user = await user.findOne({username})

        if (user){
            username = username + Math.floor(Math.random()* 10000)
        }

        const userData = {
            _id: id,
            email: email_address[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username
        }

        await user.create(userData);
    }
)

//Inngest Function to updata user data in database
const syncUserUpdate = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async({event}) => {
        const {id, first_name, last_name, email_address, image_url} = event.data
    
    const updateUserData = {
        email: email_address[0].email_address,
        full_name: first_name + ' ' + last_name,
        profile_picture: image_url
    }
    await user.findByIdAndUpdate(id, updateUserData);

        
    }
)

//Inngest Function to delete user from database
const syncUserDelation = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},
    async({event}) => {
        const {id} = event.data
        await user.findByIdAndDelete(id)

        
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdate,
    syncUserDelation
];