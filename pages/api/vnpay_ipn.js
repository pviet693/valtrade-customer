import querystring from "qs";
import sha256 from "sha256";
import * as common from "../../utils/common";

export default function (req, res) {
    let vnp_Params = req.body;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    delete vnp_Params['arrayProduct'];
    delete vnp_Params['balance'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = "ODJLXOCEWMFIEJXHJNMZUVFFVRDDXLOT"
    let signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    let checkSum = sha256(signData);

    if (secureHash === checkSum) {
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        res.status(200).json({ RspCode: "00", Message: common.ResponseCodeVNPAYTable["00"].vn });
    }
    else {
        res.status(200).json({ RspCode: "97", Message: common.ResponseCodeVNPAYTable.default.vn });
    }
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}