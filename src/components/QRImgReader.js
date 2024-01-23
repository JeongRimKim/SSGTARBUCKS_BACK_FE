import React, { useState, useRef,useEffect } from 'react';
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';

const QRImgReader = ({ onSendLocationQRValue }) => {
    const [qrcodeValue, setQrcodeValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [scanResultFile, setScanResultFile] = useState('');
    const qrRef = useRef(null);
    
    useEffect(() => {
        setQrcodeValue(onSendLocationQRValue);
        console.log("qrcodeValue : " + qrcodeValue);
        generateQrCode();
    }, [onSendLocationQRValue,qrcodeValue]);


    const generateQrCode = async () => {
        try {
            const response = await QRCode.toDataURL(qrcodeValue);
            setImageUrl(response);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadQrCode = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = qrcodeValue+'.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <div>
            {/*<h3>벨류값 : {qrcodeValue}</h3>*/}
                {imageUrl ? (
                    <>
                        <a href={imageUrl} download="qrcode.png">
                            <img src={imageUrl} alt="png" />
                        </a>
                        <button onClick={downloadQrCode}>QR 다운</button>
                    </>
                ) : null}

            </div>
        </>
    );
};
export default QRImgReader;
