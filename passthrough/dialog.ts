import { PrimeVuePTOptions } from 'primevue/config'

const dialog: PrimeVuePTOptions['dialog'] = {
  root: 'w-[90vw] md:w-[50vw] max-w-screen-md',
  header:
    'flex items-center justify-between shrink-0 bg-slate-100 text-slate-700 rounded-t-lg p-4',
  title: 'font-bold text-lg',
  pcCloseButton: {
    root: [
      'flex items-center justify-center',
      'w-8 h-8 text-slate-500 bg-transparent rounded-full transition duration-200 ease-in-out',
      'hover:text-slate-700 hover:border-transparent hover:bg-slate-200',
      'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // focus
    ],
    label: 'hidden',
  },
  content:
    'overflow-y-auto bg-slate-50 text-slate-700 px-6 pb-8 pt-2 rounded-b-lg',
  footer:
    'shrink-0 border-t-0 bg-white text-slate-700 px-6 pb-6 text-right rounded-b-lg',
  mask: 'transition duration-200 bg-slate-950/40',
  transition: {
    enterFromClass: 'opacity-0 scale-75',
    enterActiveClass: 'transition-all duration-200 ease-out',
    leaveActiveClass: 'transition-all duration-200 ease-out',
    leaveToClass: 'opacity-0 scale-75',
  },
}

export default dialog
