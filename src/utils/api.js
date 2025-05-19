import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Add response interceptor
axios.interceptors.response.use(
    (response) => {
        const { config } = response;
        const { method } = config;
        // You can handle and modify the response data here if needed
        if (method === 'post' || method === 'delete' || method === 'put' || method === 'patch') {

            if (response?.data?.message == "") {
                return response;
            }

            const successMessage = response?.data?.message || response?.data?.desc || 'Operation successful';
            Swal.fire({
                title: 'Ingelogd',
                text: successMessage,
                html: '<div class="congrats-text"></div>',
                showCloseButton: true,
                icon: 'success',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
            // toast.success(successMessage);
        }

        return response;
    },
    (error) => {
        // You can handle errors here, e.g., show a toast message, logout on certain errors, etc.
        if (error.response.status === 401 || error.response.statusText === 'Unauthorized') {
            // logout user, clear local storage, redirect to login page
            localStorage.clear();
            window.location.href = '/login';
        }
        const errorMessage = error?.response?.data?.message || error?.response?.data?.desc || error?.message;


        if (errorMessage == "") {
            return response;
        }

        if (errorMessage === 'Validation failed') {
            toast.error(error.response?.data?.validation?.body?.message || error.validation?.body?.message);
        } else {
            toast.error(errorMessage);
        }
        return Promise.reject(error);
    }
);

const axiosWrapper = async (method, url, data, token, isFormData = false) => {
    try {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const config = {
            method,
            url,
            ...axiosConfig
        };

        if (token) config.headers['Authorization'] = `Bearer ${token}`;

        if (isFormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
            config.data = data; // Use FormData directly for FormData requests
        } else {
            if (data) config.data = data;
        }

        const response = await axios(config);
        return response.data;
    } catch (error) {
        //  i need to handle some exception in my component layers so return the error
        return Promise.reject(error.response ? error.response.data : error);
        // Commenting for future use
        // throw error?.response?.data?.message || error?.message;
    }
};

export default axiosWrapper;
