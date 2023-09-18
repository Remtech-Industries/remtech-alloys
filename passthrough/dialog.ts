import { PrimeVuePTOptions } from 'primevue/config'

const dialog: PrimeVuePTOptions['dialog'] = {
  root: 'w-[50vw]',
  header: 'flex items-center justify-between shrink-0 bg-slate-50 text-slate-800 border-t-0 rounded-tl-lg rounded-tr-lg p-6',
  headerTitle: 'font-bold text-lg',
  headerIcons: 'flex items-center',
  closeButton: {
    class: [
      'flex items-center justify-center overflow-hidden relative',
      'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
      'hover:text-gray-700 hover:border-transparent hover:bg-gray-200',
      'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // focus
    ]
  },
  closeButtonIcon: 'w-4 h-4 inline-block',
  content: {
    class: [
      'overflow-y-auto',
      'bg-white text-gray-700 px-6 pb-8 pt-0',
      'rounded-bl-lg rounded-br-lg',
    ]
  },
  footer: 'shrink-0 border-t-0 bg-white text-gray-700 px-6 pb-6 text-right rounded-b-lg',
  mask: 'transition duration-200 bg-black/40',
  transition: {
    enterFromClass: 'opacity-0 scale-75',
    enterActiveClass: 'transition-all duration-200 ease-out',
    leaveActiveClass: 'transition-all duration-200 ease-out',
    leaveToClass: 'opacity-0 scale-75'
  }
}

export default dialog