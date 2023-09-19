import { PrimeVuePTOptions } from "primevue/config";

const inputText: PrimeVuePTOptions["inputtext"] = {
  root: {
    class: [
      'border p-1 rounded border-slate-200 text-slate-600',
      'focus:outline-none focus:ring-2 ring-slate-300'
    ]
  }
}

export default inputText