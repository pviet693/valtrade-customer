import Swal from 'sweetalert2';

export const Toast = (message, type, timer = 1500) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
    })

    return Toast.fire({
        icon: type,
        title: message
    })
}

export const ConfirmDialog = (title, text) => {
    const swal = Swal.mixin({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        customClass: {
            confirmButton: 'btn btn-swal-confirm',
            cancelButton: 'btn btn-swal-cancel',
            header: 'swal-header',
            title: 'swal-title',
            content: 'swal-content',
        },
        buttonsStyling: false
    })

    return swal.fire({})
}

export const Notification = (title, text, type) => {
    const swal = Swal.mixin({
        title: title,
        text: text,
        showCancelButton: false,
        confirmButtonColor: type === 'success' ? '#3085d6' : '#d9534f',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: type === 'success' ? 'btn btn-swal-confirm' : 'btn btn-swal-confirm-error',
            header: 'swal-header',
            title: 'swal-title',
            content: 'swal-content-notifi',
        },
        buttonsStyling: false
    })

    return swal.fire({
        icon: type
    })
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const formatPhone = (phone) => {
    phone = phone.toString();
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export const ToastPrime = (title, message, type, ref, timer = 3000) => {
    ref.current.show({ severity: type, summary: title, detail: message, life: timer });
}