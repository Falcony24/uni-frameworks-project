import axios from "axios"

const URL = 'http://localhost:3000'

export async function registerUser(user) {
    const configuration = {
        method: "post",
        url: `${URL}/register`,
        data: user,
        config: { withCredentials: true }
    };

    // axios(configuration)
    //     .then((result) => {
    //         setRegister(true);
    //     })
    //     .catch((error) => {
    //         error = new Error();
    //     });
}