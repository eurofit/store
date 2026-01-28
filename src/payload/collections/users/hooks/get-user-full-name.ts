import { FieldHook } from "payload";
import {User} from "@/payload/types"

export const getUserFullName: FieldHook<User, User["fullName"], User> = async ({ data }) => {
    // check if firstName and lastName exist
    if (!(data?.firstName && data?.lastName)) {
        throw new Error('firstName and lastName are required to compute fullName');
    }

    return data.firstName + " " + data.lastName

}