import { useFetch } from '#imports'
import { defineStore } from 'pinia'

export const useMaterialInfoStore = defineStore('material-info', () => {
  type Data = {
    /**
     * The last time the data was updated as a stringified timestamp with time zone.
     * Can be converted to a Date instance with `new Date(last_updated)`.
     */
    last_updated: string
    material_groups: {
      title: string
      materials: {
        title: string
        description?: string
        parts: {
          partno: string
          total_quantity: number
        }[]
      }[]
    }[]
  }
  const url = 'https://data.remtechalloys.com/material_info.json'
  const { data: materialInfo } = useFetch<Data>(url)

  return { materialInfo }
})
