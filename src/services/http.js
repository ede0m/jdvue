// in HTTP.js
import axios from 'axios'
import notify from './notify'
import router from '../router'
import NProgress from 'nprogress'

// create a new axios instance
const instance = axios.create({ 
  baseURL: process.env.VUE_APP_ROOT_API,
  headers: {
    "Content-Type": "application/json",
    timeout: 10000,
    // anything you want to add to the headers
    }
});

const getAuthToken = () => localStorage.getItem('token');
instance.interceptors.request.use(config => {
    var token = getAuthToken();
    if (token != undefined) {
        config.headers['Authorization'] = 'Bearer ' + getAuthToken();
    }
    return config;
});

// before a request is made start the nprogress
instance.interceptors.request.use(config => {
  NProgress.start()
  return config
})

// before a response is returned stop nprogress
instance.interceptors.response.use(response => {
  NProgress.done()
  return response
})

// interceptor to catch errors
const errorInterceptor = error => {
    // all the error responses
    if (!error.response){
        console.log(error);
        notify.err('Network Error', 'http');
    } 
    else {
        switch(error.response.status) {
            case 400:
                console.error(error.response.status, error.message);
                notify.warn('Data not found','http');
                break;
            case 404: // authentication error, logout the user
                notify.err( 'Not found', 'http');
                break;
            case 401: // authentication error, logout the user
                notify.err( 'Unauthorized', 'http');
                router.push("/login")
                localStorage.removeItem('token');
                break;
            default:
                console.error(error.response.status, error.message);
                notify.err('Server Error', 'http');
    
        }
    }
    NProgress.done()
    return Promise.reject(error);
}

// Interceptor for responses
const responseOkayInterceptor = response => {
    switch(response.status) {
        case 200: 
            break;
        // any other cases
        default:
            // default case
    }

    return response;
}

instance.interceptors.response.use(responseOkayInterceptor, errorInterceptor);

export default instance