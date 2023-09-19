import { PrimeVuePTOptions } from 'primevue/config'

const dataTable: PrimeVuePTOptions['datatable'] = {
  table: 'w-full text-slate-600',
  header: 'bg-slate-50 p-2 border-b border-slate-200 rounded-t',
  thead: 'bg-slate-50',
  bodyRow: 'border-b border-slate-100 hover:bg-slate-200',
  column: {
    headerCell: 'text-left p-2',
    bodyCell: 'p-2',
  }
}

export default dataTable