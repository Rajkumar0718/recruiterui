import {toast} from 'react-toastify';

export function toastMessage(type,message){
    switch(type){
        case 'success': toast.success(message);
            break;
        case 'error': toast.error(message);
            break;
    }
}