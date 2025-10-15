import ExcelJS from 'exceljs'
export default function downloadExcel(data: any[], column: any[], fileName?: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('My Sheet')
  // sheet.properties.defaultRowHeight = 100

  sheet.getRow(1).font = {
    size: 14,
    bold: true
  }
  sheet.columns = column
  data?.forEach(item => {
    const row = sheet.addRow(item)
    row.eachCell({ includeEmpty: true }, cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      // cell.border = {
      //   top: { style: 'thick' },
      //   left: { style: 'thick' },
      //   bottom: { style: 'thick' },
      //   right: { style: 'thick' }
      // }
    })
  })
  const firstRow = sheet.getRow(1)
  firstRow.eachCell({ includeEmpty: true }, cell => {
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    cell.border = {
      top: { style: 'thick' },
      left: { style: 'thick' },
      bottom: { style: 'thick' },
      right: { style: 'thick' }
    }
  })
  workbook.xlsx.writeBuffer().then(function (data) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${fileName ?? 'download'}.xlsx`
    anchor.click()
    window.URL.revokeObjectURL(url)
  })
}
