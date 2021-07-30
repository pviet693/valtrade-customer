import Swal from 'sweetalert2';
import Moment from "moment";
import crypto from 'crypto';

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

// api ghn
export const tokenGHN = "c76acf0e-9a1d-11eb-8be2-c21e19fc6803";

export const ghnShopId = "78801";

// api ghtk
export const tokenGHTK = "9411aDE81fE602c4f3bE48Cd043f0D5c09893254";

export const ghtkShopName = "S19125017 - Valtrade";

// 
export const ListProperties = [
    { name: "Model", key: "model" },
    { name: "Bộ nhớ", key: "storage" },
    { name: "Mạng", key: "network" },
    { name: "Khe cắm sim", key: "simSlot" },
    { name: "Thấm nước", key: "waterproof" },
    { name: "Kích thước màn hình", key: "sizeScreen" },
    { name: "Hệ điều hành", key: "operation" },
    { name: "Ram", key: "ram" },
    { name: "Camera trước", key: "frontCamera" },
    { name: "Camera sau", key: "rearCamera" },
    { name: "GPS", key: "gps" },
    { name: "Bluetooth", key: "bluetooth" },
    { name: "Pin", key: "pin" },
    { name: "NFC", key: "nfc" },
    { name: "Micro Usb", key: "microUsb" },
    { name: "Màu sắc", key: "colorList" },
    { name: "Chất liệu", key: "material" },
    { name: "Chức năng sản phẩm", key: "functionProduct" },
    { name: "Cổng kết nối", key: "listPort" },
    { name: "Xuất xứ", key: "origin" },
    { name: "Tay áo", key: "sleeve" },
    { name: "Kiểu dáng áo sơ mi", key: "shirtDesigns" },
    { name: "Cổ áo", key: "collar" },
    { name: "Túi áo", key: "pocket" },
    { name: "Ống quần", key: "legs" },
    { name: "Chiều dài ống", key: "pantsLength" },
    { name: "Loại quần", key: "pantsType" },
    { name: "Độ tuổi phù hợp", key: "suitableAge" },
    { name: "Hạn sử dụng", key: "expireDay" },
    { name: "Kiểu dáng", key: "style" },
    { name: "Họa tiết", key: "vignette" },
    { name: "Giới tính", key: "sex" },
    { name: "Kiểu mặt đồng hồ", key: "dialType" },
    { name: "Kiểu khóa", key: "lockType" },
    { name: "Chất liệu viền ngoài", key: "outlineMaterial" },
    { name: "Công suất", key: "wattage" },
    { name: "Chứng chỉ pvc", key: "certificatePvc" },
    { name: "Chứng chỉ PB", key: "certificatePb" },
    { name: "Chứng chỉ Bpa", key: "certificateBpa" },
]

export function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm trước";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng trước";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày trước";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " giờ trước";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút trước";
    }
    return Math.floor(seconds) + " giây";
}

export function formatTimeChat(date) {
    return Moment(new Date(date)).format("DD/MM/yyyy HH:mm:ss A");
}

export function formatTime(date) {
    return Moment(new Date(date)).format("DD/MM/yyyy-HH:mm:ss A");
}

export function vnPayDateFormat(date) {
    if (date.constructor.name !== 'Date') {
        throw new Error('vnPayDateFormat:param must be a date');
    }

    let result = '';
    result += date.getFullYear().toString();
    result += to2DigitNumber(date.getMonth() + 1);
    result += to2DigitNumber(date.getDate());
    result += to2DigitNumber(date.getHours());
    result += to2DigitNumber(date.getMinutes());
    result += to2DigitNumber(date.getSeconds());

    return result;
}

export function createMd5Hash(data) {
    return crypto
        .createHash('md5')
        .update(data)
        .digest('hex');
}

export function toUpperCase(s = '') {
    if (typeof s !== 'string') {
        throw new Error('toUpperCase:param must be string');
    }

    return s.toUpperCase();
}