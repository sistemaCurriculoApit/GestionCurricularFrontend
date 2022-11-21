import saveAs from 'file-saver';
import XlsxPopulate from 'xlsx-populate';

const getSheetData = (data: any, header: any) => {
  const fields = Object.keys(data[0]);
  const sheetData = data.map((row: any) => (
    fields.map((fieldName: string) => row[fieldName] || '')
  ));
  sheetData.unshift(header);
  return sheetData;
};

const DownloadReport = async (data: any[], header: string[], title: string) => {
  try {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    const sheetData = getSheetData(data, header);
    const totalColumns = sheetData[0].length;

    for (let i = 0; i < totalColumns; i++) {
      const column = String.fromCharCode(i + 65);
      sheet.column(column).width(25);
    }

    sheet.cell('A1').value(sheetData);
    const range = sheet.usedRange();
    const endColumn = String.fromCharCode(64 + totalColumns);
    sheet.row(1).style('bold', true);
    sheet.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
    range.style('border');
    const res = await workbook.outputAsync();
    saveAs(res, 'Homologaciones_por_solicitante.xlsx');
  } catch {
    return;
  }
};

export const DownloadAdvancementReport = async (data: any[], sufix: string) => {
  const header = [
    'Asignatura',
    'Docente',
    'Año del avance',
    'Periodo',
    'Porcentaje de avance',
    'Descripción',
    'Fecha de creación',
    'Fecha ultima actualización'
  ];

  await DownloadReport(data, header, `avances_${sufix}`);
};

export const DowloadHomologationsReport = async (data: any[], sufix: string) => {
  const header = [
    'Año',
    'Periodo',
    'Identificacion del solicitante',
    'Nombre del solicitante',
    'Asignatura del solicitante',
    'Descripcion',
    'Fecha de creación',
    'Fecha ultima actualización',
  ];

  await DownloadReport(data, header, `homologaciones_${sufix}`);
};
