import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

const downloadBoard = () => {
    console.log('download board');

    const input = document.getElementById('board');
    html2canvas(input)
        .then((canvas) => {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var blob = new Blob(canvas);
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = 'board';
            a.click();
            window.URL.revokeObjectURL(url);
            //const imgData = canvas.toDataURL('image/png');
            //const pdf = new jsPDF();
            //pdf.addImage(canvas, 'SVG', 0, 0);
            //pdf.save("download.pdf");  
        });


}

export default downloadBoard;