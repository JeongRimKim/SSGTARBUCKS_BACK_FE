import { useZxing } from "react-zxing";

const QRScanner = ({onScan}) => {
    
    const { ref } = useZxing({
        onDecodeResult(decodedResult) {
            const scannedResult = decodedResult.getText();
            onScan(scannedResult); // 부모 컴포넌트로 결과 전달
        },
        readers: ["qrcode_reader", "ean_reader", "ean_8_reader"],
    });
    


    return (
        <>
            <video ref={ref} />
        </>
    );
};

export default QRScanner;
