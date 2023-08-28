export const tailwind = {
  datatable: {
    table: {
      class: 'w-full text-slate-600'
    },
    header: {
      class: 'bg-slate-50 p-2 border-b border-slate-200 rounded-t'
    },
    thead: {
      class: 'bg-slate-50'
    },
    bodyRow: {
      class: 'border-b border-slate-100 hover:bg-slate-200'
    },
    column: {
      headerCell: {
        class: 'text-left p-2'
      },
      bodyCell: {
        class: 'p-2'
      }
    }
  },
  inputText: {
    root: {
      class: [
        'border p-1 rounded border-slate-200 text-slate-600',
        'focus:outline-none focus:ring-2 ring-slate-300'
      ]
    }
  }
}