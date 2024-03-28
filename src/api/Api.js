import { toast } from 'react-toastify';
export function getCurrentUser () {
    return JSON.parse(sessionStorage.getItem("user"));
}

export function authHeader() {
    const currentUser = getCurrentUser();
    const token = sessionStorage.getItem('token');
    if (currentUser && token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

export function errorHandler(error) {
    console.log(error);
    switch (error.response?.data?.message) {
        case 401: if (error.response?.data?.message.includes('expired')) {
            toast.error('session has been expired')
            logOut();
            break;
        }
            logOut();
            toast.error('You have been logged out!')
            window.location = "/";
            break;
        case 500: toast.error(error.response?.data?.message);
            break;
        default: toast.error("something went wrong");
    }
}

export function logOut() {
    sessionStorage.clear();
}