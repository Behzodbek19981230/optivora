import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const generatePDF = async (printRef1: any, printRef2: any, text: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  var width = pdf.internal.pageSize.getWidth()
  var height = pdf.internal.pageSize.getHeight()
  const margin = 10 // Har bir chetdan chetlanish

  // Birinchi elementni qo'shish
  const element1 = printRef1.current
  const element2 = printRef2.current

  let yPos = margin

  if (element1) {
    const canvas1 = await html2canvas(element1)
    const imgData1 = canvas1.toDataURL('image/png')
    const imgWidth1 = width - margin * 2
    const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width

    // Agar birinchi elementni sig'dirish mumkin bo'lsa
    if (yPos + imgHeight1 <= height - margin) {
      pdf.addImage(imgData1, 'JPEG', margin, yPos, imgWidth1, imgHeight1)
      yPos += imgHeight1 + 5 // Yangi element uchun joy qoldirish
    } else {
      // Agar sig'masa, yangi sahifa qo'shish
      pdf.addPage()
      yPos = margin
      pdf.addImage(imgData1, 'JPEG', margin, yPos, imgWidth1, imgHeight1)
      yPos += imgHeight1 + 5
    }
  }

  // Ikkinchi elementni qo'shish
  if (element2) {
    const canvas2 = await html2canvas(element2)
    const imgData2 = canvas2.toDataURL('image/png')
    const imgWidth2 = width - margin * 2
    const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width

    // Agar ikkinchi elementni sig'dirish mumkin bo'lsa
    if (yPos + imgHeight2 <= height - margin) {
      pdf.addImage(imgData2, 'JPEG', margin, yPos, imgWidth2, imgHeight2)
    } else {
      // Yangi sahifa qo'shish
      pdf.addPage()
      yPos = margin
      pdf.addImage(imgData2, 'JPEG', margin, yPos, imgWidth2, imgHeight2)
    }
  }

  // PDFni saqlash
  pdf.save(`${text}.pdf`)
}
