import Swal from 'sweetalert2';
import Moment from "moment";

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
];

export const PaymentMethods = [
    { label: "Thanh toán khi nhận hàng", value: "local" },
    { label: "Thanh toán Paypal", value: "paypal" },
    { label: "Thanh toán VNPAY", value: "vnpay" }
];

export const ListBanks = [
    { label: "ABBANK", value: "Ngân hàng thương mại cổ phần An Bình (ABBANK)" },
    { label: "ACB", value: "Ngân hàng ACB" },
    { label: "AGRIBANK", value: "Ngân hàng Nông nghiệp (Agribank)" },
    { label: "BACABANK", value: "Ngân Hàng TMCP Bắc Á" },
    { label: "BIDV", value: "Ngân hàng đầu tư và phát triển Việt Nam (BIDV)" },
    { label: "DONGABANK", value: "Ngân hàng Đông Á (DongABank)" },
    { label: "EXIMBANK", value: "Ngân hàng EximBank" },
    { label: "HDBANK", value: "Ngân hàng HDBank" },
    { label: "IVB", value: "Ngân hàng TNHH Indovina (IVB)" },
    { label: "MBBANK", value: "Ngân hàng thương mại cổ phần Quân đội" },
    { label: "MSBANK", value: "Ngân hàng Hàng Hải (MSBANK)" },
    { label: "NAMABANK", value: "Ngân hàng Nam Á (NamABank)" },
    { label: "NCB", value: "Ngân hàng Quốc dân (NCB)" },
    { label: "OCB", value: "Ngân hàng Phương Đông (OCB)" },
    { label: "OJB", value: "Ngân hàng Đại Dương (OceanBank)" },
    { label: "PVCOMBANK", value: "Ngân hàng TMCP Đại Chúng Việt Nam" },
    { label: "SACOMBANK", value: "Ngân hàng TMCP Sài Gòn Thương Tín (SacomBank)" },
    { label: "SAIGONBANK", value: "Ngân hàng thương mại cổ phần Sài Gòn Công Thương" },
    { label: "SCB", value: "Ngân hàng TMCP Sài Gòn (SCB)" },
    { label: "SHB", value: "Ngân hàng Thương mại cổ phần Sài Gòn - Hà Nội(SHB)" },
    { label: "TECHCOMBANK", value: "Ngân hàng Kỹ thương Việt Nam (TechcomBank)" },
    { label: "TPBANK", value: "Ngân hàng Tiên Phong (TPBank)" },
    { label: "VPBANK", value: "Ngân hàng Việt Nam Thịnh vượng (VPBank)" },
    { label: "SEABANK", value: "Ngân Hàng TMCP Đông Nam Á" },
    { label: "VIB", value: "Ngân hàng Thương mại cổ phần Quốc tế Việt Nam (VIB)" },
    { label: "VIETABANK", value: "Ngân hàng TMCP Việt Á" },
    { label: "VIETBANK", value: "Ngân hàng thương mại cổ phần Việt Nam Thương Tín" },
    { label: "VIETCAPITALBANK", value: "Ngân Hàng Bản Việt" },
    { label: "VIETCOMBANK", value: "Ngân hàng Ngoại thương (Vietcombank)" },
    { label: "VIETINBANK", value: "Ngân hàng Công thương (Vietinbank)" },
    { label: "BIDC", value: "Ngân Hàng BIDC" },
    { label: "LAOVIETBANK", value: "NGÂN HÀNG LIÊN DOANH LÀO - VIỆT" },
    { label: "WOORIBANK", value: "Ngân hàng TNHH MTV Woori Việt Nam" },
    { label: "AMEX", value: "American Express" },
    { label: "VISA", value: "Thẻ quốc tế Visa" },
    { label: "MASTERCARD", value: "Thẻ quốc tế MasterCard" },
    { label: "JCB", value: "Thẻ quốc tế JCB" },
    { label: "UPI", value: "UnionPay International" },
    { label: "VNMART", value: "Ví điện tử VnMart" },
    { label: "VNPAYQR", value: "Cổng thanh toán VNPAYQR" },
    { label: "1PAY", value: "Ví điện tử 1Pay" },
    { label: "FOXPAY", value: "Ví điện tử FOXPAY" },
    { label: "VIMASS", value: "Ví điện tử Vimass" },
    { label: "VINID", value: "Ví điện tử VINID" },
    { label: "VIVIET", value: "Ví điện tử Ví Việt" },
    { label: "VNPTPAY", value: "Ví điện tử VNPTPAY" },
    { label: "YOLO", value: "Ví điện tử YOLO" },
    { label: "VIETCAPITALBANK", value: "Ngân Hàng Bản Việt" },
];

export const ListOrderTypes = [
    { label: "100000", value: "Thực Phẩm - Tiêu Dùng" },
    { label: "110000", value: "Điện thoại - Máy tính bảng" },
    { label: "120000", value: "Điện gia dụng" },
    { label: "130000", value: "Máy tính - Thiết bị văn phòng" },
    { label: "140000", value: "Điện tử - Âm thanh" },
    { label: "150000", value: "Sách/Báo/Tạp chí" },
    { label: "160000", value: "Thể thao, dã ngoại" },
    { label: "170000", value: "Khách sạn & Du lịch" },
    { label: "180000", value: "Ẩm thực" },
    { label: "190000", value: "Giải trí & Đào tạo" },
    { label: "200000", value: "Thời trang" },
    { label: "210000", value: "Sức khỏe - Làm đẹp" },
    { label: "220000", value: "Mẹ & Bé" },
    { label: "230000", value: "Vật dụng nhà bếp" },
    { label: "240000", value: "Xe cộ - phương tiện" },
    { label: "250000", value: "Thanh toán hóa đơn" },
    { label: "250007", value: "Vé máy bay" },
    { label: "260000", value: "Mua mã thẻ" },
    { label: "270000", value: "Nhà thuốc - Dịch vụ y tế" }
];

export const ResponseCodeVNPAYTable = {
    '00': {
        vn: 'Giao dịch thành công',
        en: 'Approved',
    },
    '01': {
        vn: 'Giao dịch đã tồn tại',
        en: 'Transaction is already exist',
    },
    '02': {
        vn: 'Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)',
        en: 'Invalid merchant (check vnp_TmnCode value)',
    },
    '03': {
        vn: 'Dữ liệu gửi sang không đúng định dạng',
        en: 'Sent data is not in the right format',
    },
    '04': {
        vn: 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
        en: 'Payment website is not available',
    },
    '05': {
        vn:
            'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
        en: 'Transaction failed: Too many wrong password input',
    },
    '06': {
        vn:
            'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
        en: 'Transaction failed: Wrong OTP input',
    },
    '07': {
        vn:
            'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
        en: 'This transaction is suspicious',
    },
    '08': {
        vn:
            'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
        en:
            'Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.',
    },
    '09': {
        vn:
            'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
        en: 'Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.',
    },
    '10': {
        vn: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
        en: 'Transaction failed: Customer incorrectly validate the card / account information more than 3 times',
    },
    '11': {
        vn: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
        en: 'Transaction failed: Pending payment is expired. Please try again.',
    },
    '24': {
        vn: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
        en: 'Transaction canceled',
    },
    '51': {
        vn: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
        en: 'Transaction failed: Your account is not enough balance to make the transaction.',
    },
    '65': {
        vn: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
        en: 'Transaction failed: Your account has exceeded the daily limit.',
    },
    '75': {
        vn: 'Ngân hàng thanh toán đang bảo trì',
        en: 'Banking system is under maintenance',
    },
    default: {
        vn: 'Giao dịch thất bại',
        en: 'Failured',
    },
};

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